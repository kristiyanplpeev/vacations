import { AbsenceTypesEnum } from '../common/constants';
import { Userdb } from '../model/user.entity';

export interface HolidayPeriod {
  startingDate: Date;
  endingDate: Date;
}

export type AbsencePeriodWithStatus = Array<{ date: Date; status: string }>;

export interface PTO {
  id: string;
  type: AbsenceTypesEnum;
  from_date: Date;
  to_date: Date;
  comment: string;
  employee: Userdb;
}

export interface AbsencePeriod {
  startingDate: Date;
  endingDate?: Date;
}

export interface AbsenceDetails extends AbsencePeriod {
  id?: string;
  type: AbsenceTypesEnum;
  comment?: string;
}

export interface PTODetailsWithEachDay {
  id: string;
  from_date: Date;
  to_date: Date;
  comment: string;
  employee: Userdb;
  eachDayStatus: AbsencePeriodWithStatus;
}

export interface PTODetailsWithTotalDays {
  id: string;
  from_date: Date;
  to_date: Date;
  comment: string;
  totalDays: number;
  PTODays: number;
}

export interface Holiday {
  id: string;
  date: Date;
  movable: boolean;
  comment: string;
}
