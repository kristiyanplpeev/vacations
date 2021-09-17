import { Userdb } from 'src/model/user.entity';

export interface HolidayPeriod {
  startingDate: string;
  endingDate: string;
}

export type HolidaysDaysStatus = Array<{ date: string; status: string }>;

export interface PTO {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  employee: Userdb;
}

export interface PTODetails {
  id?: string;
  startingDate: string;
  endingDate: string;
  comment: string;
}

export interface PTODetailsWithEachDay {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  employee: Userdb;
  eachDayStatus: HolidaysDaysStatus;
}

export interface PTODetailsWithTotalDays {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  totalDays: number;
  PTODays: number;
}
