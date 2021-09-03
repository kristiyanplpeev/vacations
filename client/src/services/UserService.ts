import axios from "axios";
import { injectable } from "inversify";

import { BASE_URL } from "common/constants";
import { IUserWithTeamAndPosition } from "common/interfaces";
import { IAuthService, IUserService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class UserService implements IUserService {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);

  getAllUsers = async (): Promise<Array<IUserWithTeamAndPosition>> => {
    const headers = {
      "Content-Type": "application/json",
      // eslint-disable-next-line prettier/prettier
      Authorization: `Bearer ${this.authService.getToken()}`,
    };
    return (await axios.get(`${BASE_URL}users`, { headers })).data;
  };
}

export default UserService;
