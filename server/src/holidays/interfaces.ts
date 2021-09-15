import { PTOStatus } from '../common/constants';
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
  status: PTOStatus;
  employee: Userdb;
  approvers: Array<Userdb>;
}

export interface PTODetails {
  id?: string;
  startingDate: string;
  endingDate: string;
  comment: string;
  approvers: Array<string>;
}

export interface PTODetailsWithEachDay {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
  employee: Userdb;
  approvers: Array<Userdb>;
  eachDayStatus: HolidaysDaysStatus;
}

export interface PTODetailsWithTotalDays {
  totalDays: number;
  PTODays: number;
  from_date: string;
  to_date: string;
  comment: string;
  status: PTOStatus;
  id: string;
}
