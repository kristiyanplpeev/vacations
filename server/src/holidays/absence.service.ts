import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Absencedb } from '../model/absence.entity';
import { Userdb } from '../model/user.entity';
import {
  CustomRepositoryCannotInheritRepositoryError,
  Repository,
} from 'typeorm';
import { HolidaysService } from './holidays.service';
import {
  AbsenceDetailsWithTotalDays,
  AbsenceDetailsWithEachDay,
  Absence,
  AbsenceDetailsOptional,
  SprintPeriod,
} from './interfaces';
import {
  DayStatus,
  noTeamError,
  sprintLengthDays,
  UserRelations,
} from '../common/constants';
import Guard from '../utils/Guard';
import { User } from '../google/utils/interfaces';
import DateUtil from '../utils/DateUtil';
import { AbsenceTypes } from './absenceTypes/absenceTypes';
import { UsersService } from '../users/users.service';
import {
  addDays,
  differenceInCalendarDays,
  differenceInDays,
  getHours,
  setHours,
} from 'date-fns';

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absencedb) private absenceRepo: Repository<Absencedb>,
    @InjectRepository(Userdb) private userRepo: Repository<Userdb>,
    private readonly holidaysService: HolidaysService,
    private readonly usersService: UsersService,
  ) {}

  private validateAbsenceAuthor(
    absence: Absence,
    user: User,
    message: string,
  ): void {
    if (user.id !== absence.employee.id) {
      throw new UnauthorizedException(message);
    }
  }

  public async postAbsence(absence: AbsenceTypes, user: User): Promise<string> {
    const userAbsences = await this.getUserAbsences(user);
    await absence.validate(userAbsences);
    const absenceCalculatedDetails = await absence.getAbsenceDetails();
    const employee = this.userRepo.create(user);
    const newAbsence = this.absenceRepo.create({
      type: absenceCalculatedDetails.type,
      from_date: DateUtil.dateToString(absenceCalculatedDetails.startingDate),
      to_date: DateUtil.dateToString(absenceCalculatedDetails.endingDate),
      comment: absenceCalculatedDetails.comment,
      is_deleted: false,
      employee,
    });

    await this.absenceRepo.save(newAbsence);

    return 'Absence added successfully.';
  }

  public async getEndingDate(absence: AbsenceTypes): Promise<Date> {
    Guard.should(
      absence.isEndDateCalculable(),
      `The submitted absence type is not with calculable end date.`,
    );

    const endDate = await absence.getAbsenceEndDate();
    return endDate;
  }

  async calculateAbsenceWorkingDays(
    absences: Array<Absence>,
  ): Promise<Array<AbsenceDetailsWithTotalDays>> {
    const userAbsencesWithCalculatedWorkingDays = absences.map(async (el) => {
      const eachDayStatus = await this.holidaysService.calculateDays(
        el.startingDate,
        el.endingDate,
      );
      const workDays = eachDayStatus.filter(
        (elem) => elem.status === DayStatus.workday,
      );
      return {
        ...el,
        totalDays: eachDayStatus.length,
        workingDays: workDays.length,
      };
    });

    return await Promise.all(userAbsencesWithCalculatedWorkingDays);
  }

  public async getUserAbsences(
    user: User,
  ): Promise<Array<AbsenceDetailsWithTotalDays>> {
    Guard.isValidUUID(user.id, `Invalid user id: ${user.id}`);
    const userAbsencesDb = await this.absenceRepo.find({
      where: { employee: user.id },
      relations: [UserRelations.employee],
    });
    const userAbsences = userAbsencesDb.map((el) => el.toAbsence());

    const nonDeletedUserAbsences = userAbsences.filter(
      (absence) => absence.isDeleted === false,
    );

    return await this.calculateAbsenceWorkingDays(nonDeletedUserAbsences);
  }

  public async getAllUsersAbsencesByTeam(
    userId: string,
  ): Promise<Array<AbsenceDetailsWithTotalDays>> {
    Guard.isValidUUID(userId, `Invalid user id: ${userId}`);

    const { team } = await this.userRepo.findOne({
      where: { id: userId },
      relations: [UserRelations.teams],
    });
    Guard.should(team !== null, noTeamError);

    const usersDb = await this.userRepo.find({ where: { team } });
    const users = usersDb.map((u) => u.toUser());

    const allUsersAbsences = users.map(async (user) => {
      const absencesDb = await this.absenceRepo.find({
        where: { employee: user.id },
        relations: [UserRelations.employee],
      });
      const absences = absencesDb
        .map((a) => a.toAbsence())
        .filter((a) => !a.isDeleted);

      return await this.calculateAbsenceWorkingDays(absences);
    });

    const getAllUsersAbsences = await Promise.all(allUsersAbsences);

    return getAllUsersAbsences.flat();
  }

  private async getAbsenceDetails(absenceId: string): Promise<Absence> {
    const absencedb = await this.absenceRepo.findOne({
      where: { id: absenceId },
      relations: [UserRelations.employee],
    });
    Guard.exists(absencedb, `Absence with id ${absenceId} does not exist.`);
    Guard.should(!absencedb.is_deleted, 'The absence is no longer available.');
    return absencedb.toAbsence();
  }

  public async getAbsenceWithEachDayStatus(
    absenceId: string,
  ): Promise<AbsenceDetailsWithEachDay> {
    const absenceInfo = await this.getAbsenceDetails(absenceId);

    const eachDayStatus = await this.holidaysService.calculateDays(
      absenceInfo.startingDate,
      absenceInfo.endingDate,
    );
    const AbsenceWithPeriodEachDayStatus = { ...absenceInfo, eachDayStatus };
    return AbsenceWithPeriodEachDayStatus;
  }

  public async getAbsenceDetailsById(absenceId: string): Promise<Absence> {
    const AbsenceDetails = await this.getAbsenceDetails(absenceId);
    return AbsenceDetails;
  }

  public async editAbsence(
    absence: AbsenceTypes,
    user: User,
    absenceId: string,
  ): Promise<string> {
    const userAbsences = await this.getUserAbsences(user);
    await absence.validate(userAbsences);
    const absenceCalculatedDetails = await absence.getAbsenceDetails();
    Guard.isValidUUID(user.id, `Invalid user id: ${user.id}`);
    const absencedb = await this.absenceRepo.findOne({
      where: { id: absenceId },
      relations: [UserRelations.employee],
    });
    Guard.exists(absencedb, `Absence with id ${absenceId} does not exist.`);
    Guard.should(!absencedb.is_deleted, 'Deleted absences can not be edited.');
    const currentAbsence = absencedb.toAbsence();
    this.validateAbsenceAuthor(
      currentAbsence,
      user,
      'Only the owner of the absence can edit it.',
    );

    absencedb.from_date = DateUtil.dateToString(
      absenceCalculatedDetails.startingDate,
    );
    absencedb.to_date = DateUtil.dateToString(
      absenceCalculatedDetails.endingDate,
    );
    absencedb.comment = absenceCalculatedDetails.comment;
    await this.absenceRepo.save(absencedb);

    return 'Absence edited successfully.';
  }

  public async deleteAbsence(user: User, absenceId: string): Promise<string> {
    Guard.isValidUUID(user.id, `Invalid user id: ${user.id}`);
    const absencedb = await this.absenceRepo.findOne({
      where: { id: absenceId },
      relations: [UserRelations.employee],
    });
    Guard.exists(absencedb, `Absence with id ${absenceId} does not exist.`);
    Guard.should(!absencedb.is_deleted, 'Absence has already been deleted.');

    const absence = absencedb.toAbsence();

    this.validateAbsenceAuthor(
      absence,
      user,
      'Only the owner of the absence can delete it.',
    );

    absencedb.is_deleted = true;

    await this.absenceRepo.save(absencedb);

    return 'Absence deleted successfully.';
  }

  getSprintPeriod(sprintIndex: number): SprintPeriod {
    const firstSprintBeginning = new Date(process.env.SPRINT_START_DATE);
    const today = new Date('2021-11-15');
    const daysSinceFirstSprint = differenceInCalendarDays(
      today,
      firstSprintBeginning,
    );

    const defaultSprint = Math.ceil(
      (daysSinceFirstSprint + 1) / sprintLengthDays,
    );
    const defaultSprintEndingDate = addDays(
      firstSprintBeginning,
      defaultSprint * sprintLengthDays - 1,
    );
    
    const requestedSprint = defaultSprint + sprintIndex;

    const startingDate = addDays(
      firstSprintBeginning,
      (requestedSprint - 1) * sprintLengthDays,
    );
    const endingDate = addDays(
      firstSprintBeginning,
      requestedSprint * sprintLengthDays - 1,
    );
    const requestedSprintPeriod = {
      startingDate: DateUtil.roundDate(startingDate),
      endingDate: DateUtil.roundDate(endingDate),
    };

    if (differenceInCalendarDays(defaultSprintEndingDate, today) < 2) {
      requestedSprintPeriod.startingDate = addDays(
        requestedSprintPeriod.startingDate,
        sprintLengthDays,
      );
      requestedSprintPeriod.endingDate = addDays(
        requestedSprintPeriod.endingDate,
        sprintLengthDays,
      );
    }

    if (requestedSprintPeriod.startingDate < firstSprintBeginning) {
      throw new BadRequestException('We do not have data before that period');
    }

    return requestedSprintPeriod;
  }

  // sprint index 0 means current sprint, 1 means next sprint and -1 means last sprint
  public async getTeamSprintAbsences(
    sprintIndex: number,
    userId: string,
  ): Promise<any> {
    const user = await this.usersService.getUserById(userId);
    Guard.should(!!user.team, noTeamError);

    const sprintPeriod = this.getSprintPeriod(sprintIndex);

    return sprintPeriod;
  }
}
