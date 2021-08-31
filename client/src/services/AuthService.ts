import axios from "axios";
import { injectable } from "inversify";
import jwtDecode from "jwt-decode";

import { BASE_URL, emptyUser } from "common/constants";
import { IAuthService } from "inversify/interfaces";
import "reflect-metadata";
import { IUserDetails } from "store/user/types";

@injectable()
class AuthService implements IAuthService {
  logInUser = async (): Promise<IUserDetails> => {
    const res = (await axios.get(`${BASE_URL}auth/users`, { withCredentials: true })).data;
    localStorage.setItem("token", res.access_token);
    return this.extractUser(res.access_token);
  };

  getToken = (): string => localStorage.getItem("token") || "";

  extractUser = (token: string): IUserDetails => {
    try {
      return jwtDecode(token);
    } catch {
      return emptyUser;
    }
  };
}

export default AuthService;
