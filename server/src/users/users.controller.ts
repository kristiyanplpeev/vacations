import { Controller, UseGuards, Get, Query, Post, Body, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard } from '../google/guards';
import {
  UpdateTeamsDto,
  UpdatePositionsDto,
  UserWithTeamAndPositionAsStringsResponseDto,
  PositionsResponseDto,
  TeamsResponseDto,
  UpdateRolesDto,
} from './dto/users.dto';
import { plainToClass } from 'class-transformer';
import { UserResponseDto } from '../google/dto/google.dto';
import { RolesEnum } from '../common/constants';
import { Roles } from '../google//decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RolesEnum.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async getUsersByTeamAndPosition(
    @Query('teamId') teamId: string,
    @Query('positionId') positionId: string,
    @Query('role') role: RolesEnum,
  ): Promise<Array<UserWithTeamAndPositionAsStringsResponseDto>> {
    const users = await this.usersService.getFilteredUsers(teamId, positionId, role);
    return plainToClass(UserWithTeamAndPositionAsStringsResponseDto, users);
  }

  @Get('byId')
  @Roles(RolesEnum.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Put('teams')
  @Roles(RolesEnum.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async updateTeams(
    @Body() body: UpdateTeamsDto,
  ): Promise<Array<UserResponseDto>> {
    const updatedUsers = await this.usersService.updateTeams(body.users, body.teamId);
    return plainToClass(UserResponseDto, updatedUsers);
  }

  @Put('positions')
  @Roles(RolesEnum.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async updatePositions(
    @Body() body: UpdatePositionsDto,
  ): Promise<Array<UserResponseDto>> {
    const updatedUsers = await this.usersService.updatePositions(body.users, body.positionId);
    return plainToClass(UserResponseDto, updatedUsers);
  }

  @Put('roles')
  @Roles(RolesEnum.admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  public async updateUsersRole(
    @Body() body: UpdateRolesDto,
  ): Promise<Array<UserResponseDto>> {
    const updatedUsers = await this.usersService.updateUsersRole(body.users, body.role);
    return plainToClass(UserResponseDto, updatedUsers);
  }
}
