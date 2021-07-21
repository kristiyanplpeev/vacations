export type UserInfoActionTypes = {
  type: string;
  payload: { id: string; googleId: string; email: string; firstName: string; lastName: string; picture: string } | null;
};

export type UserStatusActionTypes = {
  type: string;
  payload: boolean;
};

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
  userStatusReducer: boolean;
  userInfoReducer: UserInfoReducerState;
}
