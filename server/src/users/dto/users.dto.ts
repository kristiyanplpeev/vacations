import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import { PositionsEnum, TeamsEnum } from '../../common/constants';

export class UpdateUserDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'You must provide at least one user' })
  @IsString({ each: true })
  users: Array<string>;
}

export class UpdateTeamsDto extends UpdateUserDto {
  @IsString()
  teamId: string;
}

export class UpdatePositionsDto extends UpdateUserDto {
  @IsString()
  positionId: string;
}

export class UserWithTeamAndPositionAsStringsResponseDto {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  team: TeamsEnum;
  position: PositionsEnum;
}

export class TeamsResponseDto {
  id: string;
  team: string;
}

export class PositionsResponseDto {
  id: string;
  position: string;
}