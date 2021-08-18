import { injectable } from "inversify";
import { Action, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { noLoggedUser, user } from "common/constants";
import { IAuthenticationActionCreator, IAuthService } from "inversify/interfaces";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";
import { ApplicationState, AppActions } from "store/user/types";

export type AppThunk = ThunkAction<void, ApplicationState, null, Action<string>>;

@injectable()
class AuthenticationActionCreator implements IAuthenticationActionCreator {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);

  logInUser = async (): Promise<AppActions> => {
    const userDetails = await this.authService.logInUser();
    const payload = {
      isAuthenticated: true,
      user: userDetails,
    };
    return {
      type: user.login,
      payload,
    };
  };

  logOutUser = (): AppActions => ({
    type: user.logout,
    payload: noLoggedUser,
  });

  checkIfUserIsLoggedIn = (): AppActions => {
    const userDetails = this.authService.extractUser(this.authService.getToken());
    const payload = {
      isAuthenticated: true,
      user: userDetails,
    };
    return {
      type: user.check,
      payload,
    };
  };

  logInUserDispatch = () => {
    return async (dispatch: Dispatch<AppActions>): Promise<void> => {
      dispatch(await this.logInUser());
    };
  };

  logOutUserDispatch = () => {
    return (dispatch: Dispatch<AppActions>): void => {
      dispatch(this.logOutUser());
    };
  };

  checkIfUserIsLoggedInDispatch = () => {
    return (dispatch: Dispatch<AppActions>): void => {
      dispatch(this.checkIfUserIsLoggedIn());
    };
  };
}

export default AuthenticationActionCreator;
