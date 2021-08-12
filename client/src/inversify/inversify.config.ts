import { Container } from "inversify";

import { IHolidaysService, IUserService } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import HolidaysService from "services/HolidaysService";
import UserService from "services/UserService";
import "reflect-metadata";

const myContainer = new Container();
myContainer.bind<IUserService>(TYPES.UserLogger).to(UserService);
myContainer.bind<IHolidaysService>(TYPES.Holidays).to(HolidaysService);

export { myContainer };
