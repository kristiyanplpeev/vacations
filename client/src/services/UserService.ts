import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { UserInfoType } from "common/types";
import { UserServiceInterface } from "inversify/interfaces";
import { extractUser } from "providers/tokenManagment";
import "reflect-metadata";

@injectable()
class UserService implements UserServiceInterface {
  logInUserRequest = async (): Promise<UserInfoType> => {
    const res = (await axios.get(`${BASE_URL}auth/users`, { withCredentials: true })).data;
    localStorage.setItem("token", res.access_token);
    return extractUser(res.access_token);
  };
}

export default UserService;
