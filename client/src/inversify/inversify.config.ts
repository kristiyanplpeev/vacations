import { Container } from "inversify";

import { HolidaysServiceInterface, UserServiceInterface } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import HolidaysService from "services/HolidaysService";
import UserService from "services/UserService";
import "reflect-metadata";

const myContainer = new Container();
myContainer.bind<UserServiceInterface>(TYPES.UserLogger).to(UserService);
myContainer.bind<HolidaysServiceInterface>(TYPES.Holidays).to(HolidaysService);

export { myContainer };
