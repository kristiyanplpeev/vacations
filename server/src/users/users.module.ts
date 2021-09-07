import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from '../model/holiday.entity';
import { PTO } from '../model/pto.entity';
import { User } from '../model/user.entity';
import { Teams } from '../model/teams.entity';
import { Positions } from '../model/positions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday, PTO, User, Teams, Positions])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
