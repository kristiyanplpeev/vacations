import { BadRequestException, Injectable } from '@nestjs/common';
import { Holidaydb } from '../model/holiday.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbsencePeriod, AbsencePeriodEachDay, Holiday } from './interfaces';
import DateUtil from '../utils/DateUtil';
import { DayStatus } from '../common/constants';
import * as _ from 'lodash';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holidaydb) private holidayRepo: Repository<Holidaydb>,
  ) {}

  getConstantHolidaysByYear = async (
    absenceStartingDateYear: number,
  ): Promise<Array<Holiday>> => {
    const constantHolidays = await this.holidayRepo.find({
      where: { movable: false },
    });

    const constantHolidaysForCurrentYear = constantHolidays
      .map((el) => el.toHoliday())
      .map((el) => {
        const constantHolidaysFromDB = el.date;
        constantHolidaysFromDB.setFullYear(absenceStartingDateYear);
        return { ...el, date: constantHolidaysFromDB };
      });

    const constantHolidaysForCurrentYearCpy = _.cloneDeep(
      constantHolidaysForCurrentYear,
    );
    const constantHolidaysForTheNextYear =
      constantHolidaysForCurrentYearCpy.map((el) => {
        const constantHolidaysFromDB = el.date;
        constantHolidaysFromDB.setFullYear(absenceStartingDateYear + 1);
        return {
          ...el,
          date: constantHolidaysFromDB,
        };
      });

    return [
      ...constantHolidaysForCurrentYear,
      ...constantHolidaysForTheNextYear,
    ];
  };

  getMovableHolidaysForTheSubmittedPeriod = async (
    absencePeriod: AbsencePeriod,
  ): Promise<Array<Holiday>> => {
    try {
      const movableHolidays = await this.holidayRepo.find({
        movable: true,
        date: Between(
          DateUtil.dateToString(absencePeriod.startingDate),
          DateUtil.dateToString(absencePeriod.endingDate),
        ),
      });

      return movableHolidays.map((el) => el.toHoliday());
    } catch (error) {
      throw new BadRequestException('Invalid dates submitted.');
    }
  };

  getDatesWithAllHolidaysAndWeekends = (
    days: AbsencePeriodEachDay,
    movableHolidays: Array<Holiday>,
    constantHolidays: Array<Holiday>,
  ): AbsencePeriodEachDay => {
    const datesWithWeekends = days.map((el) => {
      if (el.date.getDay() == 6 || el.date.getDay() == 0) {
        el.status = DayStatus.weekend;
      }
      return el;
    });

    const datesWithMovableHolidays = datesWithWeekends.reduce((acc, el) => {
      for (let i = 0; i < movableHolidays.length; i++) {
        if (el.date.getTime() === movableHolidays[i].date.getTime()) {
          el.status = movableHolidays[i].comment;
        }
      }
      return [...acc, el];
    }, []);
    const datesWithAllHolidaysAndWeekends = constantHolidays.reduce(
      (dates, constantHoliday) => {
        for (let i = 0; i < dates.length; i++) {
          if (
            constantHoliday.date.getDate() === dates[i].date.getDate() &&
            constantHoliday.date.getMonth() === dates[i].date.getMonth() &&
            constantHoliday.date.getFullYear() === dates[i].date.getFullYear()
          ) {
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
    startingDate: Date,
    endingDate: Date,
  ): Promise<AbsencePeriodEachDay> {
    const absenceStartAndEndDate = {
      startingDate,
      endingDate,
    };
    const datesBetween = DateUtil.getPeriodBetweenDates(absenceStartAndEndDate);
    const constantHolidays = await this.getConstantHolidaysByYear(
      startingDate.getFullYear(),
    );

    const movableHolidays = await this.getMovableHolidaysForTheSubmittedPeriod(
      absenceStartAndEndDate,
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
