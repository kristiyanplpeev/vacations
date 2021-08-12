import {
  IHolidayInfo,
  HolidayDaysInfoType,
  UserInfoType,
  IHolidayFullInfo,
  UserHolidayType,
  PTOFullInfo,
} from "common/types";

export interface IUserService {
  logInUserRequest(): Promise<UserInfoType>;
}

export interface IHolidaysService {
  getHolidayInfoRequest({ startingDate, endingDate }: IHolidayInfo): Promise<HolidayDaysInfoType>;
  addPTORequest({
    startingDate,
    endingDate,
    comment,
    approvers,
  }: IHolidayFullInfo): Promise<void | { warning: string }>;
  userPTOsRequest(): Promise<Array<UserHolidayType>>;
  PTODetailedRequest(PTOId: string): Promise<PTOFullInfo>;
}

export interface INewPTO {}
export interface IRedirecting {
  componentDidMount(): Promise<void>;
}
