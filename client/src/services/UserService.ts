import { injectable } from "inversify";

import { anyPosition, anyRole, anyTeam, UserRolesEnum } from "common/constants";
import { IPositions, ITeams, IUserWithTeamAndPosition } from "common/interfaces";
import { IAuthService, IRestClient, IUserService } from "inversify/interfaces";
import "reflect-metadata";
// eslint-disable-next-line import/no-cycle
import { myContainer } from "inversify/inversify.config";
import { TYPES } from "inversify/types";
import { IUserDetails } from "store/user/types";

interface IToken {
  access_token: string;
}

@injectable()
class UserService implements IUserService {
  private authService = myContainer.get<IAuthService>(TYPES.Auth);
  private restClient = myContainer.get<IRestClient>(TYPES.Rest);

  logInUser = async (): Promise<IUserDetails> => {
    const res = await this.restClient.get<IToken>("auth/users", { withCredentials: true });
    localStorage.setItem("token", res.access_token);
    return this.authService.extractUser(res.access_token);
  };

  getAllUsers = async (
    teamId?: string,
    positionId?: string,
    role?: string,
  ): Promise<Array<IUserWithTeamAndPosition>> => {
    const team = teamId !== anyTeam ? `teamId=${teamId}` : "";
    const position = positionId !== anyPosition ? `positionId=${positionId}` : "";
    const roles = role !== anyRole ? `role=${role}` : "";
    const query = [team, position, roles].filter((el) => el).join("&");
    return await this.restClient.get(`users?${query}`);
  };

  getUsersByIds = async (usersIds: string): Promise<Array<IUserWithTeamAndPosition>> => {
    return await this.restClient.get(`users/byId?usersIds=${usersIds}`);
  };

  getTeams = async (): Promise<Array<ITeams>> => {
    return await this.restClient.get(`users/teams`);
  };

  getPositions = async (): Promise<Array<IPositions>> => {
    return await this.restClient.get(`users/positions`);
  };

  updateUsersTeam = async (users: Array<string>, newTeamId: string): Promise<void> => {
    const data = {
      users,
      teamId: newTeamId,
    };
    await this.restClient.put(`users/teams`, { data });
  };

  updateUsersPosition = async (users: Array<string>, newPositionId: string): Promise<void> => {
    const data = {
      users,
      positionId: newPositionId,
    };
    await this.restClient.put(`users/positions`, { data });
  };

  updateUsersRole = async (users: Array<string>, newRole: UserRolesEnum): Promise<void> => {
    const data = {
      users,
      role: newRole,
    };
    await this.restClient.put(`users/roles`, { data });
  };
}

export default UserService;
