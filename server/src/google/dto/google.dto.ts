import { Positions, Teams } from "../../users/interfaces";

export class UserResponseDto {
    id: string;
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    team: Teams;
    position: Positions;
  }
  