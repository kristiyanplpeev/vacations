/* eslint-disable import/no-cycle */
import { Container } from "inversify";

import {
  IHolidayService,
  IAbsenceService,
  IAuthService,
  IAuthenticationActionCreator,
  IUserService,
  IRestClient,
} from "inversify/interfaces";
import { TYPES } from "inversify/types";
import AbsenceService from "services/AbsenceService";
import AuthService from "services/AuthService";
import HolidayService from "services/HolidayService";
import { RestClient } from "services/RestClient";
import UserService from "services/UserService";
import "reflect-metadata";
import AuthenticationActionCreator from "store/user/ActionCreator";

const myContainer = new Container();
myContainer.bind<IAuthService>(TYPES.Auth).to(AuthService).inSingletonScope();
myContainer.bind<IHolidayService>(TYPES.Holidays).to(HolidayService).inSingletonScope();
myContainer.bind<IAbsenceService>(TYPES.Absence).to(AbsenceService).inSingletonScope();
myContainer.bind<IUserService>(TYPES.user).to(UserService).inSingletonScope();
myContainer.bind<IRestClient>(TYPES.Rest).to(RestClient).inSingletonScope();
myContainer.bind<IAuthenticationActionCreator>(TYPES.AuthAction).to(AuthenticationActionCreator).inSingletonScope();

export { myContainer };
