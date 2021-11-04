import { Exclude } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { PositionsEnum, RolesEnum, TeamsEnum } from '../../common/constants';

export class GetTeamByIdDto {
  @IsUUID('all', { message: 'Invalid team id' })
  id: string;
}

export class CreateTeamDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}

const newCoefficientError = 'New coefficient must be between 0.1 and 1.';

export class UpdateUserDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'You must provide at least one user' })
  @IsUUID('all', { each: true, message: 'Invalid user ids' })
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

export class UpdateRolesDto extends UpdateUserDto {
  @IsString()
  role: RolesEnum;
}

export class IdDto {
  @IsUUID('all', { message: 'Invalid id' })
  id: string;
}

export class UpdatePositionCoefficientDto {
  @IsNumber({}, { message: 'New coefficient must be a number' })
  @Min(0.1, { message: newCoefficientError })
  @Max(1, { message: newCoefficientError })
  newCoefficient: number;
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
  @Exclude()
  isDeleted: boolean;
}

export class PositionsResponseDto {
  id: string;
  position: string;
  coefficient: number;
  sortOrder: number;
}
