import { BadRequestException, Injectable } from '@nestjs/common';
import { Holidaydb } from '../model/holiday.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HolidayPeriodDto } from './dto/holidays.dto';
import { HolidayPeriod, HolidaysDaysStatus } from './interfaces';
import DateUtil from '../utils/DateUtil';
import { DayStatus } from '../common/constants';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holidaydb) private holidayRepo: Repository<Holidaydb>,
  ) {}

  getConstantHolidaysForTheCurrentYear = async (
    holidayPeriod: HolidayPeriod,
  ): Promise<Array<Holidaydb>> => {
    try {
      const constantHolidays = await this.holidayRepo.find({
        where: { movable: false },
      });
      const constantHolidaysForCurrentYear = constantHolidays.map((el) => {
        const databaseDateArr = el.date.split('-');
        const givenDateArr = holidayPeriod.startingDate.split('-');
        if (databaseDateArr[0] !== givenDateArr[0]) {
          return {
            ...el,
            date: `${givenDateArr[0]}-${databaseDateArr[1]}-${databaseDateArr[2]}`,
          };
        }
        return el;
      });
      return constantHolidaysForCurrentYear;
    } catch (error) {
      throw new BadRequestException('Invalid dates submitted.');
    }
  };

  getMovableHolidaysForTheCurrentYear = async (
    holidayPeriod: HolidayPeriod,
  ): Promise<Array<Holidaydb>> => {
    try {
      const movableHolidays = await this.holidayRepo.find({
        movable: true,
        date: Between(holidayPeriod.startingDate, holidayPeriod.endingDate),
      });

      return movableHolidays;
    } catch (error) {
      throw new BadRequestException('Invalid dates submitted.');
    }
  };

  getDatesWithAllHolidaysAndWeekends = (
    days: HolidaysDaysStatus,
    movableHolidays: Array<Holidaydb>,
    constantHolidays: Array<Holidaydb>,
  ): HolidaysDaysStatus => {
    const datesWithWeekends = days.map((el) => {
      if (new Date(el.date).getDay() == 6 || new Date(el.date).getDay() == 0) {
        el.status = DayStatus.weekend;
      }
      return el;
    });
    const datesWithMovableHolidays = datesWithWeekends.reduce((acc, el) => {
      for (let i = 0; i < movableHolidays.length; i++) {
        if (el.date == movableHolidays[i].date) {
          el.status = movableHolidays[i].comment;
        }
      }
      return [...acc, el];
    }, []);

    const datesWithAllHolidaysAndWeekends = constantHolidays.reduce(
      (dates, constantHoliday) => {
        for (let i = 0; i < dates.length; i++) {
          if (constantHoliday.date == dates[i].date) {
            if (dates[i].status === DayStatus.workday) {
              dates[i].status = constantHoliday.comment;
            } else {
              for (let j = i; j < dates.length; j++) {
                if (dates[j].status === DayStatus.workday) {
                  dates[j].status = `${constantHoliday.comment} (in lieu)`;
                  break;
                }
              }
            }
          }
        }
        return dates;
      },
      datesWithMovableHolidays,
    );

    return datesWithAllHolidaysAndWeekends;
  };

  public async calculateDays(
    holidayPeriod: HolidayPeriodDto,
  ): Promise<HolidaysDaysStatus> {
    const holidayPeriodAsString = {
      startingDate: holidayPeriod.startingDate.toString(),
      endingDate: holidayPeriod.endingDate.toString(),
    };
    const datesBetween = DateUtil.getPeriodBetweenDates(holidayPeriodAsString);
    const constantHolidays = await this.getConstantHolidaysForTheCurrentYear(
      holidayPeriodAsString,
    );

    const movableHolidays = await this.getMovableHolidaysForTheCurrentYear(
      holidayPeriodAsString,
    );

    const datesBetweenAsObj = datesBetween.map((el) => ({
      date: el,
      status: DayStatus.workday,
    }));

    const datesWithAllHolidaysAndWeekends =
      this.getDatesWithAllHolidaysAndWeekends(
        datesBetweenAsObj,
        movableHolidays,
        constantHolidays,
      );
    return datesWithAllHolidaysAndWeekends;
  }
}
