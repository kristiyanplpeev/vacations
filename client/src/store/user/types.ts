// eslint-disable-next-line import/no-cycle
import { UserRolesEnum } from "common/constants";

export interface IUserDetails {
  sub: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
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
