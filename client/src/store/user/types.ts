export type UserInfoActionTypes = {
  type: string;
  payload: { id: string; googleId: string; email: string; firstName: string; lastName: string; picture: string } | null;
};

export type IsUserLoggedInActionTypes = {
  type: string;
  payload: boolean;
};

export type UserActionTypes = UserInfoActionTypes | IsUserLoggedInActionTypes;

export type AppActions = UserActionTypes;

export interface UserInfoReducerState {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export type UserInfoTypes = {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
};

export interface ApplicationState {
  isUserLoggedInReducer: boolean;
  userInfoReducer: UserInfoReducerState;
}
