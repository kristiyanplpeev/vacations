import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidaysController } from './holidays.controller';
import { HolidaysService } from './holidays.service';
import { Holiday } from '../model/holiday.entity';
import { PTO } from '../model/pto.entity';
import { User } from '../model/user.entity';
import { PTOsService } from './pto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday, PTO, User])],
  providers: [HolidaysService, PTOsService],
  controllers: [HolidaysController],
})
export class HolidaysModule {}
