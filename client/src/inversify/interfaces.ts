import { IHolidayInfo, HolidayDaysInfoType, UserInfoType, IHolidayFullInfo } from "common/types";

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
}

export interface NewPTOInterface {}
export interface RedirectingInterface {
  componentDidMount(): Promise<void>;
}
