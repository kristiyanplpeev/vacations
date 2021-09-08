import { ArrayMinSize, IsArray, IsString } from 'class-validator';

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
