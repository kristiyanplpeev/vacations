import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Absencedb } from '../model/absence.entity';
import { Userdb } from '../model/user.entity';
import { Repository } from 'typeorm';
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

  private validateAbsenceAuthor(absence: Absence, user: User): void {
    if (user.id !== absence.employee.id) {
      throw new UnauthorizedException(
        'Only the owner of the absence can edit it.',
      );
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

  public async getUserAbsences(
    user: User,
  ): Promise<Array<AbsenceDetailsWithTotalDays>> {
    Guard.isValidUUID(user.id, `Invalid user id: ${user.id}`);
    const userHolidays = await this.absenceRepo.find({
      where: { employee: user.id },
      relations: [UserRelations.employee],
    });

    const userAbsencesWithCalculatedWorkingDays = userHolidays
      .map((el) => el.toAbsence())
      .map(async (el) => {
        const eachDayStatus = await this.holidaysService.calculateDays(
          el.from_date,
          el.to_date,
        );
        if (Array.isArray(eachDayStatus)) {
          const workDays = eachDayStatus.filter(
            (elem) => elem.status === DayStatus.workday,
          );
          return {
            ...el,
            totalDays: eachDayStatus.length,
            workingDays: workDays.length,
          };
        }
      });
    const resolvedUserAbsences = await Promise.all(
      userAbsencesWithCalculatedWorkingDays,
    );
    return resolvedUserAbsences;
  }

  private async getAbsenceDetails(absenceId: string): Promise<Absence> {
    const absence = await this.absenceRepo.findOne({
      where: { id: absenceId },
      relations: [UserRelations.employee],
    });
    Guard.exists(absence, `Absence with id ${absenceId} does not exist.`);
    return absence.toAbsence();
  }

  public async getAbsenceWithEachDayStatus(
    absenceId: string,
  ): Promise<AbsenceDetailsWithEachDay> {
    const absenceInfo = await this.getAbsenceDetails(absenceId);

    const eachDayStatus = await this.holidaysService.calculateDays(
      absenceInfo.from_date,
      absenceInfo.to_date,
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
    const currentAbsence = absencedb.toAbsence();
    this.validateAbsenceAuthor(currentAbsence, user);

    absencedb.from_date = DateUtil.dateToString(
      absenceCalculatedDetails.startingDate,
    );
    absencedb.to_date = DateUtil.dateToString(
      absenceCalculatedDetails.endingDate,
    );
    absencedb.comment = absenceCalculatedDetails.comment;
    return (await this.absenceRepo.save(absencedb)).toAbsence();
  }
}
