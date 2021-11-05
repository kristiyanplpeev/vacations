/* eslint-disable import/no-cycle */
import { UserRolesEnum } from "common/constants";
import { IPositions, ITeams } from "common/interfaces";

export interface IUserDetails {
  sub: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  position: IPositions;
  team: ITeams;
  role: UserRolesEnum | "";
}

export interface IUserState {
  isAuthenticated: boolean;
  userDetails: IUserDetails;
}

export interface IUserDetailsAction {
  type: string;
  payload: IUserState;
}

export type AppActions = IUserDetailsAction;

export interface ApplicationState {
  isUserLoggedInReducer: boolean;
  userInfoReducer: IUserState;
}
