import { IHolidayInfo, HolidayDaysInfoType, UserInfoType, IHolidayFullInfo, UserHolidayType } from "common/types";

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
}

export interface NewPTOInterface {}
export interface RedirectingInterface {
  componentDidMount(): Promise<void>;
}
