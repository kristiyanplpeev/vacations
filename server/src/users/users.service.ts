import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Userdb } from '../model/user.entity';
import { In, Repository } from 'typeorm';
import { PositionsEnum, TeamsEnum, UserRelations } from '../common/constants';
import {
  UserWithTeamAndPositionAsStrings,
  User,
} from '../google/utils/interfaces';
import { Teamsdb } from '../model/teams.entity';
import { Positionsdb } from '../model/positions.entity';
import Guard from '../utils/Guard';
import { Positions, Teams } from '../users/interfaces';

const anyTeam = 'any team';
const anyPosition = 'any position';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Userdb) private userRepo: Repository<Userdb>,
    @InjectRepository(Teamsdb) private teamsRepo: Repository<Teamsdb>,
    @InjectRepository(Positionsdb)
    private positionsRepo: Repository<Positionsdb>,
  ) {}

  setUsersTeamsAndPositions(
    users: Array<User>,
  ): Array<UserWithTeamAndPositionAsStrings> {
    return users.reduce((acc, el) => {
      const team = el.team?.team || TeamsEnum.noTeam;
      const position = el.position?.position || PositionsEnum.noPosition;
      return [...acc, { ...el, team, position }];
    }, []);
  }

  async getTeamById(teamId: string): Promise<Teamsdb | null> {
    let team;
    if (teamId !== TeamsEnum.noTeam) {
      team = await this.teamsRepo.findOne({ id: teamId });
      Guard.exists(team, `Team with id ${teamId} does not exist`);
    } else {
      team = null;
    }
    return team;
  }

  async getPositionById(positionId: string): Promise<Positionsdb | null> {
    let position;
    if (positionId !== PositionsEnum.noPosition) {
      position = await this.positionsRepo.findOne({ id: positionId });
      Guard.exists(position, `Position with id ${positionId} does not exist`);
    } else {
      position = null;
    }
    return position;
  }

  public async getFilteredUsers(
    teamId: string,
    positionId: string,
  ): Promise<Array<UserWithTeamAndPositionAsStrings>> {
    const queryObj = {
      team: null,
      position: null,
    };
    if (teamId !== anyTeam) {
      queryObj.team = await this.getTeamById(teamId);
    } else {
      delete queryObj.team;
    }
    if (positionId !== anyPosition) {
      queryObj.position = await this.getPositionById(positionId);
    } else {
      delete queryObj.position;
    }

    const users = await this.userRepo.find({
      where: { ...queryObj },
      relations: [UserRelations.teams, UserRelations.positions],
    });

    return this.setUsersTeamsAndPositions(users);
  }

  public async getUsersByIds(
    usersIds: string,
  ): Promise<Array<UserWithTeamAndPositionAsStrings>> {
    const usersIdsArr = usersIds.split(',');
    const users = await this.userRepo.find({
      where: {
        id: In(usersIdsArr),
      },
      relations: [UserRelations.teams, UserRelations.positions],
    });
    Guard.allElementsExist<User>(usersIdsArr, users, (ids) => `Users with ids ${ids} doesn't exist.`);
    return this.setUsersTeamsAndPositions(users);
  }

  public async getTeams(): Promise<Array<Teams>> {
    return (await this.teamsRepo.find()).map((el) => el.toTeams());
  }

  public async getPositions(): Promise<Array<Positions>> {
    return (await this.positionsRepo.find()).map((el) => el.toPositions());
  }

  public async updateTeams(
    users: Array<string>,
    newTeamId: string,
  ): Promise<Array<User>> {
    const newTeam = await this.getTeamById(newTeamId);
    const usersWithTeam = await this.userRepo.find({
      where: {
        id: In(users),
      },
      relations: [UserRelations.teams],
    });
    Guard.allElementsExist<User>(users, usersWithTeam, (ids) => `Users with ids ${ids} doesn't exist.`);
    usersWithTeam.forEach((el) => {
      el.team = newTeam;
    });
    const updatedUsers = (await this.userRepo.save(usersWithTeam)).map((el) =>
    el.toUser(),
    );

    return updatedUsers;
  }

  public async updatePositions(
    users: Array<string>,
    newPositionId: string,
  ): Promise<Array<User>> {
    const newPosition = await this.getPositionById(newPositionId);
    const usersWithPosition = await this.userRepo.find({
      where: {
        id: In(users),
      },
      relations: [UserRelations.positions],
    });
    Guard.allElementsExist<User>(users, usersWithPosition, (ids) => `Users with ids ${ids} doesn't exist.`);
    usersWithPosition.forEach((el) => {
      el.position = newPosition;
    });
    const updatedUsers = (await this.userRepo.save(usersWithPosition)).map(
      (el) => el.toUser(),
    );
    return updatedUsers;
  }
}
