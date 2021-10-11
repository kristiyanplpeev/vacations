import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import { Holidaydb } from '../model/holiday.entity';
import { Absencedb } from '../model/absence.entity';
import { Userdb } from '../model/user.entity';
import { AbsencesService } from './absence.service';
import { AbsenceFactory } from './absenceTypes/absenceTypes';

@Module({
  imports: [TypeOrmModule.forFeature([Holidaydb, Absencedb, Userdb])],
  providers: [HolidaysService, AbsencesService, AbsenceFactory],
  controllers: [HolidaysController],
})
export class HolidaysModule {}
