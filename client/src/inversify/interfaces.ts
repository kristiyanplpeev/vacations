import { IHolidayInfo, HolidayDays, IUserInfo, IHolidayFullInfo, IUserHoliday, IPTOFullInfo } from "common/types";

export interface IUserService {
  logInUser(): Promise<IUserInfo>;
}

export interface IHolidaysService {
  getDatesStatus({ startingDate, endingDate }: IHolidayInfo): Promise<HolidayDays>;
}

export interface IPTOService {
  addPTO({ startingDate, endingDate, comment, approvers }: IHolidayFullInfo): Promise<void | { warning: string }>;
  userPTOs(): Promise<Array<IUserHoliday>>;
  PTODetailed(PTOId: string): Promise<IPTOFullInfo>;
}

export interface IRedirecting {
  componentDidMount(): Promise<void>;
}
