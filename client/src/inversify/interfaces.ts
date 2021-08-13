import { IHolidayInfo, HolidayDays, IUserInfo, IHolidayFullInfo, IUserHoliday, IPTOFullInfo } from "common/types";

export interface IUserService {
  logInUserRequest(): Promise<IUserInfo>;
}

export interface IHolidaysService {
  getHolidayInfoRequest({ startingDate, endingDate }: IHolidayInfo): Promise<HolidayDays>;
  addPTORequest({
    startingDate,
    endingDate,
    comment,
    approvers,
  }: IHolidayFullInfo): Promise<void | { warning: string }>;
  userPTOsRequest(): Promise<Array<IUserHoliday>>;
  PTODetailedRequest(PTOId: string): Promise<IPTOFullInfo>;
}

export interface INewPTO {}
export interface IRedirecting {
  componentDidMount(): Promise<void>;
}
