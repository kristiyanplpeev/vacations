import { Positions, Teams } from '../../users/interfaces';
import { PositionsEnum, TeamsEnum, RolesEnum } from '../../common/constants';

export interface Token {
  access_token: string;
}

export interface User {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  team: Teams;
  position: Positions;
  role: RolesEnum;
}

export interface UserWithTeamAndPositionAsStrings {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  team: TeamsEnum;
  position: PositionsEnum;
}
