import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { IUser } from "common/types";
import { IUserService } from "inversify/interfaces";
import { extractUser } from "providers/tokenManagment";
import "reflect-metadata";

@injectable()
class UserService implements IUserService {
  constructor() {}
  logInUser = async (): Promise<IUser> => {
    const res = (await axios.get(`${BASE_URL}auth/users`, { withCredentials: true })).data;
    localStorage.setItem("token", res.access_token);
    return extractUser(res.access_token);
  };
}

export default UserService;
