import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';
import { PositionsEnum, TeamsEnum, UserRelations } from '../common/constants';
import { UserDetailsWithTeamAndPosition } from '../google/utils/interfaces';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  //set users teams and positions
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
}
