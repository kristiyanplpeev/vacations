import { HolidayInfoType, HolidayDaysInfoType, UserInfoType } from "common/types";

export interface UserServiceInterface {
  logInUserRequest(): Promise<UserInfoType>;
}

export interface HolidaysServiceInterface {
  getHolidayInfoRequest({ startingDate, endingDate }: HolidayInfoType): Promise<HolidayDaysInfoType | null>;
}

export interface NewPTOInterface {}
export interface RedirectingInterface {
  componentDidMount(): Promise<void>;
}
