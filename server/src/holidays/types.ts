import { User } from 'src/model/user.entity';

export type HolidayPeriod = {
  startingDate: string;
  endingDate: string;
};

export type HolidaysDaysStatus = { date: string; status: string }[];

export type PTOFullInfo = {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
  employee: User;
  approvers: Array<User>;
  eachDayStatus: HolidaysDaysStatus;
};
