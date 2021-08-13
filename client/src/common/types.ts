export type IUserInfo = {
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

export type HolidayDays = Array<{ date: string; status: string }>;

export type TextFieldType = {
  value: string;
  isValid: boolean;
  validate: (value: string) => boolean;
  errorText: string;
};

export interface IUserHolidayBasicInfo {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
}

export interface IUserHoliday extends IUserHolidayBasicInfo {
  PTODays: number;
  totalDays: number;
}

export interface Error {
  error: string;
}

export interface IPTOFullInfo extends IUserHolidayBasicInfo {
  employee: IUserInfo;
  approvers: Array<IUserInfo>;
  eachDayStatus: HolidayDays;
}
