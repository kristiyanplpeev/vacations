import { Dispatch } from "redux";

import { IPTOPeriod, HolidayDays, IPTO, IUserPTOWithCalcDays, IUserPTOFullDetails } from "common/types";
import { AppActions, IUserDetails } from "store/user/types";

export interface IAuthService {
  logInUser(): Promise<IUserDetails>;
  getToken(): string;
  extractUser(token: string): IUserDetails;
}

export interface IHolidayService {
  getDatesStatus({ startingDate, endingDate }: IPTOPeriod): Promise<HolidayDays>;
}

export interface IAuthenticationActionCreator {
  logInUser(): Promise<AppActions>;
  logOutUser(): AppActions;
  checkIfUserIsLoggedIn(): AppActions;
  logInUserDispatch(): (dispatch: Dispatch<AppActions>) => Promise<void>;
  logOutUserDispatch(): (dispatch: Dispatch<AppActions>) => void;
  checkIfUserIsLoggedInDispatch(): (dispatch: Dispatch<AppActions>) => void;
}

export interface IPTOService {
  addPTO({ startingDate, endingDate, comment, approvers }: IPTO): Promise<void | { warning: string }>;
  getUserPTOs(): Promise<Array<IUserPTOWithCalcDays>>;
  PTODetailed(PTOId: string): Promise<IUserPTOFullDetails>;
}
