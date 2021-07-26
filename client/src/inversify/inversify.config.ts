import { Container } from "inversify";

import { UserServiceInterface } from "inversify/interfaces";
import { TYPES } from "inversify/types";
import UserService from "services/UserService";
import "reflect-metadata";

const myContainer = new Container();
myContainer.bind<UserServiceInterface>(TYPES.UserLogger).to(UserService);

export { myContainer };
