import axios from "axios";
import { injectable } from "inversify";

import { applicationJSON, BASE_URL } from "common/constants";
import { IPositions, ITeams, IUserWithTeamAndPosition } from "common/interfaces";
import { IAuthService, IUserService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";

@injectable()
class UserService implements IUserService {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);

  private headers = {
    "Content-Type": applicationJSON,
    // eslint-disable-next-line prettier/prettier
    Authorization: `Bearer ${this.authService.getToken()}`,
  };

  getAllUsers = async (teamId: string, positionId: string): Promise<Array<IUserWithTeamAndPosition>> => {
    return (await axios.get(`${BASE_URL}users?teamId=${teamId}&positionId=${positionId}`, { headers: this.headers }))
      .data;
  };

  getUsersByIds = async (usersIds: string): Promise<Array<IUserWithTeamAndPosition>> => {
    return (await axios.get(`${BASE_URL}users/byId?usersIds=${usersIds}`, { headers: this.headers })).data;
  };

  getTeams = async (): Promise<Array<ITeams>> => {
    return (await axios.get(`${BASE_URL}users/teams`, { headers: this.headers })).data;
  };

  getPositions = async (): Promise<Array<IPositions>> => {
    return (await axios.get(`${BASE_URL}users/positions`, { headers: this.headers })).data;
  };

  updateUsersTeam = async (users: Array<string>, newTeamId: string): Promise<void> => {
    const data = {
      users,
      teamId: newTeamId,
    };
    await axios.post(`${BASE_URL}users/teams`, data, { headers: this.headers });
  };

  updateUsersPosition = async (users: Array<string>, newPositionId: string): Promise<void> => {
    const data = {
      users,
      positionId: newPositionId,
    };
    await axios.post(`${BASE_URL}users/positions`, data, { headers: this.headers });
  };
}

export default UserService;
