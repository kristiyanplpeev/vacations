import { PositionsEnum, TeamsEnum } from '../../common/constants';

export interface Token {
  access_token: string;
}

export interface UserDetails {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface UserDetailsWithTeamAndPosition extends UserDetails {
  team: TeamsEnum;
  position: PositionsEnum;
}
