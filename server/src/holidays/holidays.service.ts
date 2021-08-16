import { Injectable } from '@nestjs/common';
import { Holiday } from '../model/holiday.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HolidayPeriodDto } from './dto/holidays.dto';
import { HolidayPeriod, HolidaysDaysStatus } from 'src/holidays/types';
import DateUtil from '../utils/Utils';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday) private holidayRepo: Repository<Holiday>,
  ) {}

  getConstantHolidaysForTheCurrentYear = async (
    holidayPeriod: HolidayPeriod,
  ): Promise<Array<Holiday>> => {
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
      throw new Error('Invalid dates submitted.');
    }
  };

  getMovableHolidaysForTheCurrentYear = async (
    holidayPeriod: HolidayPeriod,
  ): Promise<Array<Holiday>> => {
    try {
      const movableHolidays = await this.holidayRepo.find({
        movable: true,
        date: Between(holidayPeriod.startingDate, holidayPeriod.endingDate),
      });

      return movableHolidays;
    } catch (error) {
      throw new Error('Invalid dates submitted.');
    }
  };

  getDatesWithAllHolidaysAndWeekends = (
    datesBetweenAsObj: Array<{
      date: string;
      status: string;
    }>,
    movableHolidays: Array<Holiday>,
    constantHolidays: Array<Holiday>,
  ): Array<{
    date: string;
    status: string;
  }> => {
    const datesWithWeekends = datesBetweenAsObj.map((el) => {
      if (new Date(el.date).getDay() == 6 || new Date(el.date).getDay() == 0) {
        el.status = 'weekend';
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

    const datesWirhAllHolidaysAndWeekends = constantHolidays.reduce(
      (dates, constantHoliday) => {
        for (let i = 0; i < dates.length; i++) {
          if (constantHoliday.date == dates[i].date) {
            if (dates[i].status === 'workday') {
              dates[i].status = constantHoliday.comment;
            } else {
              for (let j = i; j < dates.length; j++) {
                if (dates[j].status === 'workday') {
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

    return datesWirhAllHolidaysAndWeekends;
  };

  public async calculateDays(
    holidayPeriod: HolidayPeriodDto,
  ): Promise<HolidaysDaysStatus> {
    try {
      const holidayPeriodAsString = {
        startingDate: holidayPeriod.startingDate.toString(),
        endingDate: holidayPeriod.endingDate.toString(),
      };
      const datesBetween = DateUtil.getPeriodBetweenDates(
        holidayPeriodAsString,
      );
      const constantHolidays = await this.getConstantHolidaysForTheCurrentYear(
        holidayPeriodAsString,
      );

      const movableHolidays = await this.getMovableHolidaysForTheCurrentYear(
        holidayPeriodAsString,
      );

      const datesBetweenAsObj = datesBetween.map((el) => ({
        date: el,
        status: 'workday',
      }));

      const datesWithAllHolidaysAndWeekends =
        this.getDatesWithAllHolidaysAndWeekends(
          datesBetweenAsObj,
          movableHolidays,
          constantHolidays,
        );
      return datesWithAllHolidaysAndWeekends;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
