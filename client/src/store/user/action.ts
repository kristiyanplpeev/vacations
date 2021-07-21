import { store } from "store/store";
import { UserInfoTypes } from "store/user/types";

export const logInUser = (userInfo: UserInfoTypes): void => {
  store.dispatch({
    type: "LOGIN_USER",
    payload: userInfo,
  });
};

export const logOutUser = (): void => {
  store.dispatch({
    type: "LOGOUT USER",
    payload: null,
  });
};

export const setLoginStatus = (status: boolean): void => {
  status
    ? store.dispatch({
        type: "LOGIN",
        payload: status,
      })
    : store.dispatch({
        type: "LOGOUT",
        payload: status,
      });
};
