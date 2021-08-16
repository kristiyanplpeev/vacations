import { IPTOPeriod, HolidayDays, IUser, IPTO, IUserPTOWithCalcDays, IUserPTOFullDetails } from "common/types";

export interface IUserService {
  logInUser(): Promise<IUser>;
}

export interface IHolidaysService {
  getDatesStatus({ startingDate, endingDate }: IPTOPeriod): Promise<HolidayDays>;
}

export interface IPTOService {
  addPTO({ startingDate, endingDate, comment, approvers }: IPTO): Promise<void | { warning: string }>;
  getUserPTOs(): Promise<Array<IUserPTOWithCalcDays>>;
  PTODetailed(PTOId: string): Promise<IUserPTOFullDetails>;
}
