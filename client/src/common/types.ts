import { UserInfo } from "os";

export type UserInfoType = {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
};

export interface IHolidayInfo {
  startingDate: string;
  endingDate: string;
}

export interface IHolidayFullInfo extends IHolidayInfo {
  comment: string;
  approvers: Array<string>;
}

export type HolidayDaysInfoType = Array<{ date: string; status: string }>;

export type TextFieldType = {
  value: string;
  isValid: boolean;
  validate: (value: string) => boolean;
  errorText: string;
};

export type UserHolidayBasicInfoType = {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
};

export type UserHolidayType = {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
  PTODays: number;
  totalDays: number;
};

export type ErrorType = {
  error: string;
};

export type PTOFullInfo = {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
  employee: UserInfoType;
  approvers: Array<UserInfoType>;
  eachDayStatus: HolidayDaysInfoType;
};
