import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../google/guards';
import { UserDetailsWithTeamAndPosition } from '../google/utils/interfaces';
import { Teams } from '../model/teams.entity';
import { Positions } from '../model/positions.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUsers(): Promise<Array<UserDetailsWithTeamAndPosition>> {
    return await this.usersService.getAllUsers();
  }

  @Get('byId')
  @UseGuards(JwtAuthGuard)
  public async getUsersByIds(
    @Query('usersIds') usersIds: string,
  ): Promise<Array<UserDetailsWithTeamAndPosition>> {
    return await this.usersService.getUsersByIds(usersIds);
  }

  @Get('teams')
  @UseGuards(JwtAuthGuard)
  public async getTeams(): Promise<Array<Teams>> {
    return await this.usersService.getTeams();
  }

  @Get('positions')
  @UseGuards(JwtAuthGuard)
  public async getPositions(): Promise<Array<Positions>> {
    return await this.usersService.getPositions();
  }
}
