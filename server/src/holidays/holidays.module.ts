import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import { Holidaydb } from '../model/holiday.entity';
import { PTOdb } from '../model/pto.entity';
import { Userdb } from '../model/user.entity';
import { PTOsService } from './pto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Holidaydb, PTOdb, Userdb])],
  providers: [HolidaysService, PTOsService],
  controllers: [HolidaysController],
})
export class HolidaysModule {}
