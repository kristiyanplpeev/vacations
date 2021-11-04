import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Userdb } from '../model/user.entity';
import { In, Repository } from 'typeorm';
import {
  PositionsEnum,
  RolesEnum,
  TeamsEnum,
  UserRelations,
} from '../common/constants';
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
      Guard.isValidUUID(teamId, `Invalid team id: ${teamId}`);
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
      Guard.isValidUUID(positionId, `Invalid position id: ${positionId}`);
      position = await this.positionsRepo.findOne({ id: positionId });
      Guard.exists(position, `Position with id ${positionId} does not exist`);
    } else {
      position = null;
    }
    return position;
  }

  public async getAllUsers(): Promise<Array<User>> {
    const users = (
      await this.userRepo.find({
        relations: [UserRelations.teams, UserRelations.positions],
      })
    ).map((u) => u.toUser());

    return users;
  }

  public async getFilteredUsers(
    teamId: string,
    positionId: string,
    role: RolesEnum,
  ): Promise<Array<UserWithTeamAndPositionAsStrings>> {
    const queryObj = {
      team: null,
      position: null,
      role: null,
    };
    if (teamId) {
      queryObj.team = await this.getTeamById(teamId);
    } else {
      delete queryObj.team;
    }
    if (positionId) {
      queryObj.position = await this.getPositionById(positionId);
    } else {
      delete queryObj.position;
    }
    if (role) {
      Guard.should(
        Object.values(RolesEnum).includes(role),
        `Role "${role}" is not supported.`,
      );
      queryObj.role = role;
    } else {
      delete queryObj.role;
    }

    const usersdb = await this.userRepo.find({
      where: { ...queryObj },
      relations: [UserRelations.teams, UserRelations.positions],
    });

    const users = usersdb.map((user) => user.toUser());

    return this.setUsersTeamsAndPositions(users);
  }

  public async getUsersByIds(
    usersIds: string,
  ): Promise<Array<UserWithTeamAndPositionAsStrings>> {
    const usersIdsArr = usersIds.split(',');

    usersIdsArr.forEach((el) => {
      Guard.isValidUUID(el, `User id ${el} is invalid`);
    });
    const usersdb = await this.userRepo.find({
      where: {
        id: In(usersIdsArr),
      },
      relations: [UserRelations.teams, UserRelations.positions],
    });
    Guard.allElementsExist<Userdb>(
      usersIdsArr,
      usersdb,
      (ids) => `Users with ids ${ids} doesn't exist.`,
    );

    const users = usersdb.map((user) => user.toUser());

    return this.setUsersTeamsAndPositions(users);
  }

  public async getTeams(): Promise<Array<Teams>> {
    const teamsdb = await this.teamsRepo.find();
    const nonDeletedTeams = teamsdb
      .filter((t) => !t.is_deleted)
      .map((t) => t.toTeams());

    return nonDeletedTeams;
  }

  public async getPositions(): Promise<Array<Positions>> {
    return (await this.positionsRepo.find()).map((el) => el.toPositions());
  }

  public async postTeam(name: string): Promise<Teams> {
    const existingTeams = await (
      await this.teamsRepo.find({ where: { is_deleted: false } })
    ).map((t) => t.toTeams().team);

    Guard.should(
      !existingTeams.includes(name),
      `This team name already exists!`,
    );

    const newTeam = this.teamsRepo.create({
      team: name,
    });
    await this.teamsRepo.save(newTeam);

    return newTeam.toTeams();
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
    Guard.allElementsExist<Userdb>(
      users,
      usersWithTeam,
      (ids) => `Users with ids ${ids} doesn't exist.`,
    );
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
    Guard.allElementsExist<Userdb>(
      users,
      usersWithPosition,
      (ids) => `Users with ids ${ids} doesn't exist.`,
    );
    usersWithPosition.forEach((el) => {
      el.position = newPosition;
    });
    const updatedUsers = (await this.userRepo.save(usersWithPosition)).map(
      (el) => el.toUser(),
    );
    return updatedUsers;
  }

  public async updateUsersRole(
    users: Array<string>,
    newRole: RolesEnum,
  ): Promise<Array<User>> {
    Guard.should(
      Object.values(RolesEnum).includes(newRole),
      `Role "${newRole}" is not supported.`,
    );
    const usersdb = await this.userRepo.find({
      where: {
        id: In(users),
      },
    });
    Guard.allElementsExist<Userdb>(
      users,
      usersdb,
      (ids) => `Users with ids ${ids} doesn't exist.`,
    );
    usersdb.forEach((el) => {
      el.role = newRole;
    });
    const updatedUsers = (await this.userRepo.save(usersdb)).map((el) =>
      el.toUser(),
    );
    return updatedUsers;
  }

  public async deleteTeam(teamId: string): Promise<string> {
    Guard.isValidUUID(teamId, `Invalid team id: ${teamId}`);
    const teamdb = await this.teamsRepo.findOne({ where: { id: teamId } });
    Guard.exists(teamdb, `Team with id ${teamId} does not exist!`);
    Guard.should(!teamdb.is_deleted, `Team has already been deleted!`);
    const isTeamEmpty =
      (await this.userRepo.find({ where: { team: teamId } })).length === 0;
    
    Guard.should(isTeamEmpty, `Can't delete this team as it is not empty!`);

    teamdb.is_deleted = true;
    await this.teamsRepo.save(teamdb);

    return 'Team deleted successfully!';
  }

  async getUserById(userId: string): Promise<User> {
    Guard.isValidUUID(userId, `Invalid user ID.`);
    const userDetails = await this.userRepo.findOne({
      where: { id: userId },
      relations: [UserRelations.positions, UserRelations.teams],
    });
    Guard.exists(userDetails, `There is no user with id ${userId}`);
    return userDetails.toUser();
  }

  async updatePositionCoefficient(
    positionId: string,
    newCoefficient: number,
  ): Promise<Positions> {
    const positiondb = await this.getPositionById(positionId);
    positiondb.coefficient = newCoefficient;
    const updatedPosition = await this.positionsRepo.save(positiondb);

    return updatedPosition.toPositions();
  }
}
