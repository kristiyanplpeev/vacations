import { Controller, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../google/guards';
import { UserDetailsWithTeamAndPosition } from '../google/utils/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUsers(): Promise<Array<UserDetailsWithTeamAndPosition>> {
    return await this.usersService.getAllUsers();
  }
}
