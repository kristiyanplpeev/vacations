import { Container } from "inversify";

import { IHolidayService, IPTOService, IAuthService, IAuthenticationActionCreator } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import AuthService from "services/AuthService";
import HolidayService from "services/HolidayService";
import PTOService from "services/PTOService";
import "reflect-metadata";
import AuthenticationActionCreator from "store/user/ActionCreator";

const myContainer = new Container();
myContainer.bind<IAuthService>(TYPES.Auth).to(AuthService);
myContainer.bind<IHolidayService>(TYPES.Holidays).to(HolidayService);
myContainer.bind<IPTOService>(TYPES.PTO).to(PTOService);
myContainer.bind<IAuthenticationActionCreator>(TYPES.AuthAction).to(AuthenticationActionCreator);

export { myContainer };
