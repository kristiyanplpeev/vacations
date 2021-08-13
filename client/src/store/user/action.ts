import { Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { AppState } from "store/store";
import { ApplicationState, UserInfoTypes, AppActions } from "store/user/types";

export type AppThunk = ThunkAction<void, ApplicationState, null, Action<string>>;

export const logInUser = (userInfo: UserInfoTypes): AppActions => ({
  type: "LOGIN_USER",
  payload: userInfo,
});

export const logOutUser = (): AppActions => ({
  type: "LOGOUT_USER",
  payload: null,
});

export const setIsUserLoggedIn = (status: boolean): AppActions => {
  if (status) {
    return {
      type: "LOGIN",
      payload: status,
    };
  } else {
    return {
      type: "LOGOUT",
      payload: status,
    };
  }
};

export const startLogInUser = (userInfoData: UserInfoTypes) => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState): void => {
    const { id = "", googleId = "", email = "", firstName = "", lastName = "", picture = "" } = userInfoData;

    const user = { id, googleId, email, firstName, lastName, picture };

    dispatch(
      logInUser({
        ...user,
      }),
    );
  };
};

export const startLogOutUser = () => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState): void => {
    dispatch(logOutUser());
  };
};

export const startSetIsUserLoggedIn = (newState: boolean) => {
  return (dispatch: Dispatch<AppActions>, getState: () => AppState): void => {
    dispatch(setIsUserLoggedIn(newState));
  };
};
