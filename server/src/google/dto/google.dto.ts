import { RolesEnum } from "../../common/constants";
import { Positions, Teams } from "../../users/interfaces";

export class UserResponseDto {
    id: string;
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    role: RolesEnum
    team: Teams;
    position: Positions;
  }
  