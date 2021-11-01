import { PositionsEnum, TeamsEnum } from "common/constants";

export interface IUser {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  role: string;
}

export interface IUserWithTeamAndPosition extends IUser {
  team: TeamsEnum;
  position: PositionsEnum;
}

export interface IAbsencePeriod {
  startingDate: string;
  endingDate: string;
}

export interface IAbsence extends IAbsencePeriod {
  comment: string;
}

export interface IAbsenceWithId extends IAbsence {
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

export interface IUserAbsence {
  id: string;
  type: string;
  startingDate: string;
  endingDate: string;
  comment: string;
}

export interface IUserAbsenceWithEmployee extends IUserAbsence {
  employee: IUser;
}

export interface IUserAbsenceWithWorkingDays extends IUserAbsence {
  workingDays: number;
  totalDays: number;
}

export interface IUserAbsenceWithWorkingDaysAndEmployee extends IUserAbsenceWithWorkingDays {
  employee: IUser;
}

export interface IUserAbsenceWithEachDayStatus extends IUserAbsenceWithEmployee {
  eachDayStatus: HolidayDays;
}

export interface ITeams {
  id: string;
  team: TeamsEnum;
}

export interface IPositions {
  id: string;
  position: PositionsEnum;
}
export interface Error {
  error: string;
}

export type OptionalWithNull<T> = T | null | undefined;
