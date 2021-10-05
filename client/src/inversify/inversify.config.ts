/* eslint-disable import/no-cycle */
import { Container } from "inversify";

import {
  IHolidayService,
  IAbsenceService,
  IAuthService,
  IAuthenticationActionCreator,
  IUserService,
} from "inversify/interfaces";
import { TYPES } from "inversify/types";
import AbsenceService from "services/AbsenceService";
import AuthService from "services/AuthService";
import HolidayService from "services/HolidayService";
import UserService from "services/UserService";
import "reflect-metadata";
import AuthenticationActionCreator from "store/user/ActionCreator";

const myContainer = new Container();
myContainer.bind<IAuthService>(TYPES.Auth).to(AuthService);
myContainer.bind<IHolidayService>(TYPES.Holidays).to(HolidayService);
myContainer.bind<IAbsenceService>(TYPES.Absence).to(AbsenceService);
myContainer.bind<IUserService>(TYPES.user).to(UserService);
myContainer.bind<IAuthenticationActionCreator>(TYPES.AuthAction).to(AuthenticationActionCreator);

export { myContainer };
