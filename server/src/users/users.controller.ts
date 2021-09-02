import { Controller, UseGuards, Get } from '@nestjs/common';
import { User } from 'src/model/user.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../google/guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUsers(): Promise<Array<User>> {
    return await this.usersService.getAllUsers();
  }
}
