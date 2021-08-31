import { PTOStatus } from '../common/constants';
import { User } from 'src/model/user.entity';

export interface HolidayPeriod {
  startingDate: string;
  endingDate: string;
}

export type HolidaysDaysStatus = Array<{ date: string; status: string }>;

export interface PTODetailsWithEachDay {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
  employee: User;
  approvers: Array<User>;
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
