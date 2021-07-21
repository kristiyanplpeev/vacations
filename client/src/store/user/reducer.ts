import { extractUser, getToken } from "providers/tokenManagment";

import { UserInfoActionTypes, UserInfoReducerState, UserInfoTypes, UserStatusActionTypes } from "./types";

const initialUserInfoState = extractUser(getToken());

const initualUserStatusState = !!getToken();

export const userInfoReducer = (
  state: UserInfoReducerState = initialUserInfoState,
  action: UserInfoActionTypes,
): UserInfoTypes | null => {
  switch (action.type) {
    case "LOGIN_USER": {
      return action.payload;
    }
    case "LOGOUT USER": {
      return { id: "", googleId: "", email: "", firstName: "", lastName: "", picture: "" };
    }
    default:
      return state;
  }
};

export const userStatusReducer = (state: boolean = initualUserStatusState, action: UserStatusActionTypes): boolean => {
  switch (action.type) {
    case "LOGIN": {
      return action.payload;
    }
    case "LOGOUT": {
      return action.payload;
    }
    default:
      return state;
  }
};
