import { HolidayInfoType, HolidayDaysInfoType, UserInfoType } from "common/types";

export interface UserServiceInterface {
  logInUserRequest(): Promise<UserInfoType>;
}

export interface HolidaysServiceInterface {
  getHolidayInfoRequest({ startingDate, endingDate }: HolidayInfoType): Promise<HolidayDaysInfoType>;
}

export interface RedirectingInterface {}

export interface NewPTOInterface {}
