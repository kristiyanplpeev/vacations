import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { In, Repository } from 'typeorm';
import { PositionsEnum, TeamsEnum, UserRelations } from '../common/constants';
import { UserDetailsWithTeamAndPosition } from '../google/utils/interfaces';
import { Teams } from '../model/teams.entity';
import { Positions } from '../model/positions.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Teams) private teamsRepo: Repository<Teams>,
    @InjectRepository(Positions) private positionsRepo: Repository<Positions>,
  ) {}

  private setUsersTeamsAndPositions(
    users: Array<User>,
  ): Array<UserDetailsWithTeamAndPosition> {
    return users.reduce((acc, el) => {
      let team = '';
      let position = '';
      if (el.team === null) {
        team = TeamsEnum.noTeam;
      } else {
        team = el.team.team;
      }
      if (el.position === null) {
        position = PositionsEnum.noPosition;
      } else {
        position = el.position.position;
      }
      return [...acc, { ...el, team, position }];
    }, []);
  }

  public async getAllUsers(): Promise<Array<UserDetailsWithTeamAndPosition>> {
    const users = await this.userRepo.find({
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
    let newTeam;
    if (newTeamId !== TeamsEnum.noTeam) {
      newTeam = await this.teamsRepo.findOne({ id: newTeamId });
    } else {
      newTeam = null;
    }
    const updatedUsers = users.map(async (userId) => {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: [UserRelations.teams],
      });
      user.team = newTeam;
      return await this.userRepo.save(user);
    });
    return Promise.all(updatedUsers);
  }

  public async updatePositions(
    users: Array<string>,
    newPositionId: string,
  ): Promise<Array<User>> {
    let newPosition;
    if (newPositionId !== PositionsEnum.noPosition) {
      newPosition = await this.positionsRepo.findOne({ id: newPositionId });
    } else {
      newPosition = null;
    }
    const updatedUsers = users.map(async (userId) => {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        relations: [UserRelations.positions],
      });
      user.position = newPosition;
      return await this.userRepo.save(user);
    });
    return Promise.all(updatedUsers);
  }
}
