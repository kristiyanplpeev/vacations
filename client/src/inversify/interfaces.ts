import { Dispatch } from "redux";

import {
  IPTOPeriod,
  HolidayDays,
  IPTO,
  IUserPTOWithCalcDays,
  IUserPTOFullDetails,
  IPTOWithId,
  IUserWithTeamAndPosition,
  ITeams,
  IPositions,
} from "common/interfaces";
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
  addPTO({ startingDate, endingDate, comment }: IPTO): Promise<void | { warning: string }>;
  getUserPTOs(): Promise<Array<IUserPTOWithCalcDays>>;
  PTODetailed(PTOId: string): Promise<IUserPTOFullDetails>;
  getRequestedPTOById(PTOId: string): Promise<IUserPTOFullDetails>;
  editPTO({ startingDate, endingDate, comment, id }: IPTOWithId): Promise<void>;
}

export interface IUserService {
  getAllUsers(teamId: string, positionId: string): Promise<Array<IUserWithTeamAndPosition>>;
  getUsersByIds(usersIds: string): Promise<Array<IUserWithTeamAndPosition>>;
  getTeams(): Promise<Array<ITeams>>;
  getPositions(): Promise<Array<IPositions>>;
  updateUsersTeam(users: Array<string>, newTeamId: string): Promise<void>;
  updateUsersPosition(users: Array<string>, newPositionId: string): Promise<void>;
}
