import { PositionsEnum, TeamsEnum } from "common/constants";

export interface IUser {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface IUserWithTeamAndPosition extends IUser {
  team: TeamsEnum;
  position: PositionsEnum;
}

export interface IPTOPeriod {
  startingDate: string;
  endingDate: string;
}

export interface IPTO extends IPTOPeriod {
  comment: string;
  approvers: Array<string>;
}

export interface IPTOWithId extends IPTO {
  id: string;
}

export type HolidayDays = Array<{ date: string; status: string }>;

export interface ITextBox {
  value: string;
  isValid: boolean;
  validate: (value: string) => boolean;
  errorText: string;
  textBoxInvalid: boolean;
}

export interface IUserPTO {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
}

export interface IUserPTOWithCalcDays extends IUserPTO {
  PTODays: number;
  totalDays: number;
}

export interface IUserPTOFullDetails extends IUserPTO {
  employee: IUser;
  approvers: Array<IUser>;
  eachDayStatus: HolidayDays;
}

export interface Error {
  error: string;
}

export type OptionalWithNull<T> = T | null | undefined;
