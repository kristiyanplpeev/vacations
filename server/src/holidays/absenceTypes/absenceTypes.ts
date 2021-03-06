import Guard from '../../utils/Guard';
import {
  AbsenceTypesEnum,
  DayStatus,
  maxYearDifference,
  nonWorkingDaysCount,
} from '../../common/constants';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AbsencePeriodEachDay,
  AbsenceDetailsWithTotalDays,
  AbsenceDetailsOptional,
} from '../interfaces';
import DateUtil from '../../utils/DateUtil';
import { HolidaysService } from '../holidays.service';
import { areIntervalsOverlapping } from 'date-fns';

@Injectable()
export class AbsenceFactory {
  constructor(private readonly holidaysService: HolidaysService) {}
  create(absenceDetails: AbsenceDetailsOptional): AbsenceTypes {
    if (
      absenceDetails.type === AbsenceTypesEnum.paidLeave ||
      absenceDetails.type === AbsenceTypesEnum.unpaidLeave
    ) {
      return new PaidAndUnpaidLeave(
        absenceDetails,
        (startingDate: Date, endingDate: Date) =>
          this.holidaysService.calculateDays(startingDate, endingDate),
      );
    } else if (
      absenceDetails.type === AbsenceTypesEnum.weddingLeave ||
      absenceDetails.type === AbsenceTypesEnum.bereavementLeave ||
      absenceDetails.type === AbsenceTypesEnum.bloodDonationLeave
    ) {
      return new AbsenceWithCalculableEndDate(
        absenceDetails,
        (startingDate: Date, endingDate: Date) =>
          this.holidaysService.calculateDays(startingDate, endingDate),
      );
    } else if (absenceDetails.type === AbsenceTypesEnum.courtLeave) {
      return new CourtLeave(
        absenceDetails,
        (startingDate: Date, endingDate: Date) =>
          this.holidaysService.calculateDays(startingDate, endingDate),
      );
    }

    throw new BadRequestException(
      `Type "${absenceDetails.type}" is not supported.`,
    );
  }
}

export abstract class AbsenceTypes {
  constructor(protected readonly absenceDetails: AbsenceDetailsOptional) {}

  async validate(
    userAbsences: Array<AbsenceDetailsWithTotalDays>,
  ): Promise<void> {
    Guard.exists(this.absenceDetails.type, 'Absence type is required.');
    Guard.exists(
      this.absenceDetails.startingDate,
      'Starting date is required.',
    );
  }

  protected validateOverlapping(
    startingDate: Date,
    endingDate: Date,
    userAbsences: Array<AbsenceDetailsWithTotalDays>,
  ): void {
    //remove currently edited absence from the validation
    const absencesWithoutCurrentOne = userAbsences.filter(
      (el) => el.id !== this.absenceDetails.id,
    );

    absencesWithoutCurrentOne.forEach((period) => {
      if (
        areIntervalsOverlapping(
          { start: startingDate, end: endingDate },
          { start: period.startingDate, end: period.endingDate },
          { inclusive: true },
        )
      ) {
        throw new BadRequestException(
          `The period you submitted is overlapping with another vacation from ${DateUtil.dateToString(
            period.startingDate,
          )} to ${DateUtil.dateToString(period.endingDate)}`,
        );
      }
    });
  }

  abstract isEndDateCalculable(): boolean;

  abstract getAbsenceEndDate(): Promise<Date>;

  protected abstract getPeriodWithStatus(): Promise<AbsencePeriodEachDay>;

  abstract getAbsenceDetails(): Promise<AbsenceDetailsOptional>;
}

class AbsenceWithCalculableEndDate extends AbsenceTypes {
  constructor(
    protected readonly absenceDetails: AbsenceDetailsOptional,
    protected getAbsencePeriodDayByDay: (
      startingDate: Date,
      endingDate: Date,
    ) => Promise<AbsencePeriodEachDay>,
  ) {
    super(absenceDetails);
  }

  isEndDateCalculable(): boolean {
    return true;
  }

  async getAbsenceEndDate(): Promise<Date> {
    const endDate = (await this.getPeriodWithStatus()).pop().date;
    return DateUtil.roundDate(endDate);
  }

  protected async getPeriodWithStatus(
    absencePeriod: AbsencePeriodEachDay = [],
    nextDate: Date = DateUtil.getTomorrowDate(this.absenceDetails.startingDate),
  ): Promise<AbsencePeriodEachDay> {
    if (
      absencePeriod.filter((el) => el.status === DayStatus.workday).length >=
      nonWorkingDaysCount
    ) {
      return absencePeriod;
    }
    absencePeriod = await this.getAbsencePeriodDayByDay(
      this.absenceDetails.startingDate,
      nextDate,
    );
    return this.getPeriodWithStatus(
      absencePeriod,
      DateUtil.getTomorrowDate(nextDate),
    );
  }

  async validate(
    userAbsences: Array<AbsenceDetailsWithTotalDays>,
  ): Promise<void> {
    super.validate(userAbsences);
    const absenceLastDate = await this.getAbsenceEndDate();
    this.validateOverlapping(
      this.absenceDetails.startingDate,
      absenceLastDate,
      userAbsences,
    );
  }

  async getAbsenceDetails(): Promise<AbsenceDetailsOptional> {
    return {
      type: this.absenceDetails.type,
      startingDate: this.absenceDetails.startingDate,
      endingDate: await this.getAbsenceEndDate(),
    };
  }
}

abstract class AbsenceWithGivenEndDate extends AbsenceTypes {
  constructor(
    protected readonly absenceDetails: AbsenceDetailsOptional,
    protected getAbsencePeriodDays: (
      startingDate: Date,
      endingDate: Date,
    ) => Promise<AbsencePeriodEachDay>,
  ) {
    super(absenceDetails);
  }

  isEndDateCalculable(): boolean {
    return false;
  }

  protected async getPeriodWithStatus(): Promise<AbsencePeriodEachDay> {
    return this.getAbsencePeriodDays(
      this.absenceDetails.startingDate,
      this.absenceDetails.endingDate,
    );
  }

  async getAbsenceEndDate(): Promise<Date> {
    return this.absenceDetails.endingDate;
  }

  private async validateAreThereWorkingDaysInPeriod(): Promise<void> {
    const isThereAWorkdayInSubmittedPeriod = (
      await this.getPeriodWithStatus()
    ).some((el) => el.status === DayStatus.workday);

    if (!isThereAWorkdayInSubmittedPeriod) {
      throw new BadRequestException(
        'There are not working days in the submitted period.',
      );
    }
  }

  private validatePeriodDates(): void {
    if (this.absenceDetails.startingDate > this.absenceDetails.endingDate) {
      throw new BadRequestException(
        'Starting date must not be after the ending date.',
      );
    }

    if (
      this.absenceDetails.endingDate.getFullYear() -
        this.absenceDetails.startingDate.getFullYear() >
      maxYearDifference
    ) {
      throw new BadRequestException(
        'The submitted period should start and end in the same or two consecutive years.',
      );
    }
  }

  async validate(
    userAbsences: Array<AbsenceDetailsWithTotalDays>,
  ): Promise<void> {
    super.validate(userAbsences);
    Guard.exists(this.absenceDetails.endingDate, 'Ending date is required.');

    this.validatePeriodDates();
    this.validateOverlapping(
      this.absenceDetails.startingDate,
      this.absenceDetails.endingDate,
      userAbsences,
    );
    await this.validateAreThereWorkingDaysInPeriod();
  }
}

class PaidAndUnpaidLeave extends AbsenceWithGivenEndDate {
  async validate(
    userAbsences: Array<AbsenceDetailsWithTotalDays>,
  ): Promise<void> {
    await super.validate(userAbsences);
    Guard.exists(this.absenceDetails.comment, 'Comment is required.');
  }

  async getAbsenceDetails(): Promise<AbsenceDetailsOptional> {
    return {
      type: this.absenceDetails.type,
      startingDate: this.absenceDetails.startingDate,
      endingDate: this.absenceDetails.endingDate,
      comment: this.absenceDetails.comment,
    };
  }
}

class CourtLeave extends AbsenceWithGivenEndDate {
  async getAbsenceDetails(): Promise<AbsenceDetailsOptional> {
    return {
      type: this.absenceDetails.type,
      startingDate: this.absenceDetails.startingDate,
      endingDate: this.absenceDetails.endingDate,
    };
  }
}
