import Guard from '../../utils/Guard';
import {
  AbsenceTypesEnum,
  DayStatus,
  nonWorkingDaysCount,
} from '../../common/constants';
import { BadRequestException } from '@nestjs/common';
import {
  AbsenceDetails,
  AbsencePeriodWithStatus,
  PTODetailsWithTotalDays,
} from '../interfaces';
import DateUtil from '../../utils/DateUtil';

export class AbsenceBehaviourFactory {
  static create(
    holidayInfo: AbsenceDetails,
    userAbsences: Array<PTODetailsWithTotalDays>,
    getAbsencePeriodDays: (
      startingDate: Date,
      endingDate: Date,
    ) => Promise<AbsencePeriodWithStatus>,
  ): AbsenceBehaviour {
    if (
      holidayInfo.type === AbsenceTypesEnum.paidLeave ||
      holidayInfo.type === AbsenceTypesEnum.unpaidLeave
    ) {
      return new PaidAndUnpaidLeaveAbsenceBehaviour(
        holidayInfo,
        userAbsences,
        getAbsencePeriodDays,
      );
    } else if (
      holidayInfo.type === AbsenceTypesEnum.weddingLeave ||
      holidayInfo.type === AbsenceTypesEnum.bereavementLeave ||
      holidayInfo.type === AbsenceTypesEnum.bloodDonationLeave
    ) {
      return new AbsenceWithCalculableEndDate(
        holidayInfo,
        userAbsences,
        getAbsencePeriodDays,
      );
    } else if (holidayInfo.type === AbsenceTypesEnum.courtLeave) {
      return new CourtLeaveAbsenceBehaviour(
        holidayInfo,
        userAbsences,
        getAbsencePeriodDays,
      );
    }

    throw new BadRequestException(
      `Type "${holidayInfo.type}" is not supported.`,
    );
  }
}

abstract class AbsenceBehaviour {
  constructor(
    protected readonly absenceDetails: AbsenceDetails,
    protected readonly userAbsences: Array<PTODetailsWithTotalDays>,
  ) {}

  validate(): void {
    Guard.exists(
      this.absenceDetails.type,
      'Starting date is required.',
    );
    Guard.exists(
      this.absenceDetails.startingDate,
      'Starting date is required.',
    );
  }

  protected validateOverlapping(startingDate: Date, endingDate: Date): void {
    //remove currently edited PTO from the validation
    const employeeAbsences = this.userAbsences.filter(
      (el) => el.id !== this.absenceDetails.id,
    );

    let overlapIndex = -1;

    for (let i = 0; i < employeeAbsences.length; i++) {
      if (
        !(
          endingDate < employeeAbsences[i].from_date ||
          startingDate > employeeAbsences[i].to_date
        )
      ) {
        overlapIndex = i;
        break;
      }
    }
    if (overlapIndex >= 0) {
      throw new BadRequestException(
        `The period you submitted is overlapping with another vacation from ${employeeAbsences[overlapIndex].from_date} to ${employeeAbsences[overlapIndex].to_date}`,
      );
    }
  }

  protected abstract getPeriodWithStatus(): Promise<AbsencePeriodWithStatus>;

  abstract getAbsenceDetails(): Promise<AbsenceDetails>;
}

class AbsenceWithCalculableEndDate extends AbsenceBehaviour {
  constructor(
    protected readonly absenceDetails: AbsenceDetails,
    protected readonly userAbsences: Array<PTODetailsWithTotalDays>,
    protected getAbsencePeriodDayByDay: (
      startingDate: Date,
      endingDate: Date,
    ) => Promise<AbsencePeriodWithStatus>,
  ) {
    super(absenceDetails, userAbsences);
  }

  private async calculateAbsenceEndDate(): Promise<Date> {
    return (await this.getPeriodWithStatus()).pop().date;
  }

  protected async getPeriodWithStatus(
    absencePeriod: AbsencePeriodWithStatus = [],
    nextDate: Date = DateUtil.getTomorrowDate(this.absenceDetails.startingDate),
  ): Promise<AbsencePeriodWithStatus> {
    if (
      absencePeriod.filter((el) => el.status === DayStatus.workday).length ===
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

  async validate(): Promise<void> {
    super.validate();
    const absenceLastDate = await this.calculateAbsenceEndDate();
    this.validateOverlapping(this.absenceDetails.startingDate, absenceLastDate);
  }

  async getAbsenceDetails(): Promise<AbsenceDetails> {
    return {
      type: this.absenceDetails.type,
      startingDate: this.absenceDetails.startingDate,
      endingDate: await this.calculateAbsenceEndDate(),
    };
  }
}

abstract class AbsenceWithGivenEndDate extends AbsenceBehaviour {
  constructor(
    protected readonly absenceDetails: AbsenceDetails,
    protected readonly userAbsences: Array<PTODetailsWithTotalDays>,
    protected getAbsencePeriodDays: (
      startingDate: Date,
      endingDate: Date,
    ) => Promise<AbsencePeriodWithStatus>,
  ) {
    super(absenceDetails, userAbsences);
  }

  protected async getPeriodWithStatus(): Promise<AbsencePeriodWithStatus> {
    return this.getAbsencePeriodDays(
      this.absenceDetails.startingDate,
      this.absenceDetails.endingDate,
    );
  }

  private async validateIsThereWorkingDaysInPeriod(): Promise<void> {
    const isThereAWorkdayInSubmittedPeriod = (
      await this.getPeriodWithStatus()
    ).some((el) => el.status === DayStatus.workday);

    if (!isThereAWorkdayInSubmittedPeriod) {
      throw new BadRequestException(
        'There are not working days in the submitted period.',
      );
    }
  }

  async validate(): Promise<void> {
    super.validate();
    Guard.exists(this.absenceDetails.endingDate, 'Ending date is required.');
    if (this.absenceDetails.startingDate > this.absenceDetails.endingDate) {
      throw new BadRequestException(
        'Starting date must not be after the ending date.',
      );
    }
    this.validateOverlapping(
      this.absenceDetails.startingDate,
      this.absenceDetails.endingDate,
    );
    await this.validateIsThereWorkingDaysInPeriod();
  }
}

class PaidAndUnpaidLeaveAbsenceBehaviour extends AbsenceWithGivenEndDate {
  constructor(
    protected readonly absenceDetails: AbsenceDetails,
    protected readonly userAbsences: Array<PTODetailsWithTotalDays>,
    getAbsencePeriodDays: (
      startingDate: Date,
      endingDate: Date,
    ) => Promise<AbsencePeriodWithStatus>,
  ) {
    super(absenceDetails, userAbsences, getAbsencePeriodDays);
  }

  async validate(): Promise<void> {
    await super.validate();
    Guard.exists(this.absenceDetails.comment, 'Comment is required.');
  }

  async getAbsenceDetails(): Promise<AbsenceDetails> {
    return {
      type: this.absenceDetails.type,
      startingDate: this.absenceDetails.startingDate,
      endingDate: this.absenceDetails.endingDate,
      comment: this.absenceDetails.comment,
    };
  }
}

class CourtLeaveAbsenceBehaviour extends AbsenceWithGivenEndDate {
  constructor(
    protected readonly absenceDetails: AbsenceDetails,
    protected readonly userAbsences: Array<PTODetailsWithTotalDays>,
    getAbsencePeriodDays: (
      startingDate: Date,
      endingDate: Date,
    ) => Promise<AbsencePeriodWithStatus>,
  ) {
    super(absenceDetails, userAbsences, getAbsencePeriodDays);
  }

  async getAbsenceDetails(): Promise<AbsenceDetails> {
    return {
      type: this.absenceDetails.type,
      startingDate: this.absenceDetails.startingDate,
      endingDate: this.absenceDetails.endingDate,
    };
  }
}
