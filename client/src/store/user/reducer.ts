import { noLoggedUser, user } from "common/constants";

import { IUserDetailsAction, IUserState } from "./types";

const initialUserState = noLoggedUser;

export const userInfoReducer = (state: IUserState = initialUserState, action: IUserDetailsAction): IUserState => {
  switch (action.type) {
    case user.login: {
      return action.payload;
    }
    case user.check: {
      return action.payload;
    }
    case user.logout: {
      return noLoggedUser;
    }
    default:
      return state;
  }
};
