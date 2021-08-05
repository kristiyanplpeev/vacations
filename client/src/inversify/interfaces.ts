import {
  HolidayInfoType,
  HolidayDaysInfoType,
  UserInfoType,
  HolidayFullInfoType,
  ErrorType,
  UserHolidayType,
} from "common/types";

export interface UserServiceInterface {
  logInUserRequest(): Promise<UserInfoType>;
}

export interface HolidaysServiceInterface {
  getHolidayInfoRequest({ startingDate, endingDate }: HolidayInfoType): Promise<HolidayDaysInfoType | null>;
  addPTORequest({
    startingDate,
    endingDate,
    comment,
    approvers,
  }: HolidayFullInfoType): Promise<void | { warning: string }>;
  userPTOsRequest(): Promise<UserHolidayType[]>;
}

export interface NewPTOInterface {}
export interface RedirectingInterface {
  componentDidMount(): Promise<void>;
}
