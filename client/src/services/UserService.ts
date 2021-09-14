import axios from "axios";
import { injectable } from "inversify";

import { applicationJSON, BASE_URL, errorHandle } from "common/constants";
import { IPositions, ITeams, IUserWithTeamAndPosition } from "common/interfaces";
import { IAuthService, IUserService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class UserService implements IUserService {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getConfig = (headers?: any) => ({
    headers: Object.assign(
      {
        "Content-Type": applicationJSON,
        // eslint-disable-next-line prettier/prettier
        Authorization: `Bearer ${this.authService.getToken()}`,
      },
      headers,
    ),
  });

  getAllUsers = async (teamId?: string, positionId?: string): Promise<Array<IUserWithTeamAndPosition>> => {
    try {
      return (await axios.get(`${BASE_URL}users?teamId=${teamId}&positionId=${positionId}`, this.getConfig())).data;
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  getUsersByIds = async (usersIds: string): Promise<Array<IUserWithTeamAndPosition>> => {
    try {
      return (await axios.get(`${BASE_URL}users/byId?usersIds=${usersIds}`, this.getConfig())).data;
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  getTeams = async (): Promise<Array<ITeams>> => {
    try {
      return (await axios.get(`${BASE_URL}users/teams`, this.getConfig())).data;
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  getPositions = async (): Promise<Array<IPositions>> => {
    try {
      return (await axios.get(`${BASE_URL}users/positions`, this.getConfig())).data;
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  updateUsersTeam = async (users: Array<string>, newTeamId: string): Promise<void> => {
    try {
      const data = {
        users,
        teamId: newTeamId,
      };
      await axios.post(`${BASE_URL}users/teams`, data, this.getConfig());
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };

  updateUsersPosition = async (users: Array<string>, newPositionId: string): Promise<void> => {
    try {
      const data = {
        users,
        positionId: newPositionId,
      };
      await axios.post(`${BASE_URL}users/positions`, data, this.getConfig());
    } catch (error) {
      throw new Error(errorHandle(error));
    }
  };
}

export default UserService;
