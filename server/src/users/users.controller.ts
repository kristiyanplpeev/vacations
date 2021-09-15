import { Controller, UseGuards, Get, Query, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../google/guards';
import {
  UpdateTeamsDto,
  UpdatePositionsDto,
  UserWithTeamAndPositionAsStringsResponseDto,
  PositionsResponseDto,
  TeamsResponseDto,
} from './dto/users.dto';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from '../google/dto/google.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUsersByTeamAndPosition(
    @Query('teamId') teamId: string,
    @Query('positionId') positionId: string,
  ): Promise<Array<UserWithTeamAndPositionAsStringsResponseDto>> {
    const users = await this.usersService.getFilteredUsers(teamId, positionId);
    return plainToClass(UserWithTeamAndPositionAsStringsResponseDto, users);
  }

  @Get('byId')
  @UseGuards(JwtAuthGuard)
  public async getUsersByIds(
    @Query('usersIds') usersIds: string,
  ): Promise<Array<UserWithTeamAndPositionAsStringsResponseDto>> {
    const users = await this.usersService.getUsersByIds(usersIds);
    return plainToClass(UserWithTeamAndPositionAsStringsResponseDto, users);
  }

  @Get('teams')
  @UseGuards(JwtAuthGuard)
  public async getTeams(): Promise<Array<TeamsResponseDto>> {
    const teams = await this.usersService.getTeams();
    return plainToClass(TeamsResponseDto, teams);
  }

  @Get('positions')
  @UseGuards(JwtAuthGuard)
  public async getPositions(): Promise<Array<PositionsResponseDto>> {
    const positions = await this.usersService.getPositions();
    return plainToClass(PositionsResponseDto, positions);
  }

  @Post('teams')
  @UseGuards(JwtAuthGuard)
  public async updateTeams(
    @Body() body: UpdateTeamsDto,
  ): Promise<Array<UserResponseDto>> {
    const updatedUsers = await this.usersService.updateTeams(body.users, body.teamId);
    return plainToClass(UserResponseDto, updatedUsers);
  }

  @Post('positions')
  @UseGuards(JwtAuthGuard)
  public async updatePositions(
    @Body() body: UpdatePositionsDto,
  ): Promise<Array<UserResponseDto>> {
    const updatedUsers = await this.usersService.updatePositions(body.users, body.positionId);
    return plainToClass(UserResponseDto, updatedUsers);
  }
}
