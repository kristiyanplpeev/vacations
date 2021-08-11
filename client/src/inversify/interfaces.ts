import {
  IHolidayInfo,
  HolidayDaysInfoType,
  UserInfoType,
  IHolidayFullInfo,
  UserHolidayType,
  PTOFullInfo,
} from "common/types";

export interface UserServiceInterface {
  logInUserRequest(): Promise<UserInfoType>;
}

export interface HolidaysServiceInterface {
  getHolidayInfoRequest({ startingDate, endingDate }: IHolidayInfo): Promise<HolidayDaysInfoType>;
  addPTORequest({
    startingDate,
    endingDate,
    comment,
    approvers,
  }: IHolidayFullInfo): Promise<void | { warning: string }>;
  userPTOsRequest(): Promise<UserHolidayType[]>;
  PTODetailedRequest(PTOId: string): Promise<PTOFullInfo>;
}

export interface NewPTOInterface {}
export interface RedirectingInterface {
  componentDidMount(): Promise<void>;
}
