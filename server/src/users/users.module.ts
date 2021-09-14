import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holidaydb } from '../model/holiday.entity';
import { PTOdb } from '../model/pto.entity';
import { Userdb } from '../model/user.entity';
import { Teamsdb } from '../model/teams.entity';
import { Positionsdb } from '../model/positions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holidaydb, PTOdb, Userdb, Teamsdb, Positionsdb])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
