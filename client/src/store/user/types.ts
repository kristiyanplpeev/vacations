export interface IUserDetails {
  sub: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  role: string;
}

export interface IUserState {
  isAuthenticated: boolean;
  user: IUserDetails;
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
