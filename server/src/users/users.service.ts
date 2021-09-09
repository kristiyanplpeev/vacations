import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { In, Repository } from 'typeorm';
import { PositionsEnum, TeamsEnum, UserRelations } from '../common/constants';
import { UserDetailsWithTeamAndPosition } from '../google/utils/interfaces';
import { Teams } from '../model/teams.entity';
import { Positions } from '../model/positions.entity';
import Guard from '../utils/Guard';

const anyTeam = 'any team';
const anyPosition = 'any position';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Teams) private teamsRepo: Repository<Teams>,
    @InjectRepository(Positions) private positionsRepo: Repository<Positions>,
  ) {}

  setUsersTeamsAndPositions(
    users: Array<User>,
  ): Array<UserDetailsWithTeamAndPosition> {
    return users.reduce((acc, el) => {
      const team = el.team?.team || TeamsEnum.noTeam;
      const position = el.position?.position || PositionsEnum.noPosition;
      return [...acc, { ...el, team, position }];
    }, []);
  }

  private async getTeamById(teamId: string): Promise<Teams | null> {
    let team;
    if (teamId !== TeamsEnum.noTeam) {
      team = await this.teamsRepo.findOne({ id: teamId });
      Guard.exists(team, `Position with id ${teamId} does not exist`);
    } else {
      team = null;
    }
    return team;
  }

  private async getPositionById(positionId: string): Promise<Positions | null> {
    let position;
    if (positionId !== PositionsEnum.noPosition) {
      position = await this.positionsRepo.findOne({ id: positionId });
      Guard.exists(position, `Position with id ${positionId} does not exist`);
    } else {
      position = null;
    }
    return position;
  }

  public async getAllUsers(
    teamId: string,
    positionId: string,
  ): Promise<Array<UserDetailsWithTeamAndPosition>> {
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
  ): Promise<Array<UserDetailsWithTeamAndPosition>> {
    const usersIdsArr = usersIds.split(',');
    const users = await this.userRepo.find({
      where: {
        id: In(usersIdsArr),
      },
      relations: [UserRelations.teams, UserRelations.positions],
    });
    return this.setUsersTeamsAndPositions(users);
  }

  public async getTeams(): Promise<Array<Teams>> {
    return await this.teamsRepo.find();
  }

  public async getPositions(): Promise<Array<Positions>> {
    return await this.positionsRepo.find();
  }

  public async updateTeams(
    users: Array<string>,
    newTeamId: string,
  ): Promise<Array<User>> {
    const newTeam = await this.getTeamById(newTeamId);
    const updatedUsers = users.map(async (userId) => {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: [UserRelations.teams],
      });
      user.team = newTeam;
      return await this.userRepo.save(user);
    });
    return await Promise.all(updatedUsers);
  }

  public async updatePositions(
    users: Array<string>,
    newPositionId: string,
  ): Promise<Array<User>> {
    const newPosition = await this.getPositionById(newPositionId);
    const updatedUsers = users.map(async (userId) => {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: [UserRelations.positions],
      });
      user.position = newPosition;
      return await this.userRepo.save(user);
    });
    return await Promise.all(updatedUsers);
  }
}
