import { injectable } from "inversify";
import jwtDecode from "jwt-decode";

import { emptyUser } from "common/constants";
import { IAuthService } from "inversify/interfaces";
import "reflect-metadata";
import { IUserDetails } from "store/user/types";

@injectable()
class AuthService implements IAuthService {
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
