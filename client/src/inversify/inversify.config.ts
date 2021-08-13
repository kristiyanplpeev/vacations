import { Container } from "inversify";

import { IHolidaysService, IPTOService, IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import HolidaysService from "services/HolidaysService";
import PTOService from "services/PTOService";
import UserService from "services/UserService";
import "reflect-metadata";

const myContainer = new Container();
myContainer.bind<IUserService>(TYPES.UserLogger).to(UserService);
myContainer.bind<IHolidaysService>(TYPES.Holidays).to(HolidaysService);
myContainer.bind<IPTOService>(TYPES.PTO).to(PTOService);

export { myContainer };
