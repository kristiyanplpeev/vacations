import { Injectable, UnauthorizedException } from '@nestjs/common';
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
} from './interfaces';
import { DayStatus, UserRelations } from '../common/constants';
import Guard from '../utils/Guard';
import { User } from '../google/utils/interfaces';
import DateUtil from '../utils/DateUtil';
import { AbsenceTypes } from './absenceTypes/absenceTypes';

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absencedb) private absenceRepo: Repository<Absencedb>,
    @InjectRepository(Userdb) private userRepo: Repository<Userdb>,
    private readonly holidaysService: HolidaysService,
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

  public async postAbsence(
    absence: AbsenceTypes,
    user: User,
  ): Promise<Absence> {
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

    return (await this.absenceRepo.save(newAbsence)).toAbsence();
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
  ): Promise<Absence> {
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
    this.validateAbsenceAuthor(currentAbsence, user, "Only the owner of the absence can edit it.");

    absencedb.from_date = DateUtil.dateToString(
      absenceCalculatedDetails.startingDate,
    );
    absencedb.to_date = DateUtil.dateToString(
      absenceCalculatedDetails.endingDate,
    );
    absencedb.comment = absenceCalculatedDetails.comment;
    return (await this.absenceRepo.save(absencedb)).toAbsence();
  }

  public async deleteAbsence(user: User, absenceId: string): Promise<Absence> {
    Guard.isValidUUID(user.id, `Invalid user id: ${user.id}`);
    const absencedb = await this.absenceRepo.findOne({
      where: { id: absenceId },
      relations: [UserRelations.employee],
    });
    Guard.exists(absencedb, `Absence with id ${absenceId} does not exist.`);
    Guard.should(!absencedb.is_deleted, 'Absence has already been deleted.');

    const absence = absencedb.toAbsence();

    this.validateAbsenceAuthor(absence, user, "Only the owner of the absence can delete it.");

    absencedb.is_deleted = true;

    return (await this.absenceRepo.save(absencedb)).toAbsence();
  }
}
