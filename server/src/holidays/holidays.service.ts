import { BadRequestException, Injectable } from '@nestjs/common';
import { Holidaydb } from '../model/holiday.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbsenceDetailsDto } from './dto/holidays.dto';
import {
  HolidayPeriod,
  AbsencePeriodWithStatus,
  AbsencePeriod,
  Holiday,
} from './interfaces';
import DateUtil from '../utils/DateUtil';
import { DayStatus } from '../common/constants';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holidaydb) private holidayRepo: Repository<Holidaydb>,
  ) {}

  getConstantHolidaysForTheCurrentYear = async (
    absencePeriod: HolidayPeriod,
  ): Promise<Array<Holiday>> => {
    const constantHolidays = await this.holidayRepo.find({
      where: { movable: false },
    });
    const constantHolidaysForCurrentYear = constantHolidays
      .map((el) => el.toHoliday())
      .map((el) => {
        const constantHolidaysFromDB = el.date;
        const absenceStartingDateYear =
          absencePeriod.startingDate.getFullYear();
        constantHolidaysFromDB.setFullYear(absenceStartingDateYear);
        return { ...el, date: constantHolidaysFromDB };
      });
    return constantHolidaysForCurrentYear;
  };

  getMovableHolidaysForTheCurrentYear = async (
    holidayPeriod: HolidayPeriod,
  ): Promise<Array<Holiday>> => {
    try {
      const movableHolidays = await this.holidayRepo.find({
        movable: true,
        date: Between(
          DateUtil.dateToString(holidayPeriod.startingDate),
          DateUtil.dateToString(holidayPeriod.endingDate),
        ),
      });

      return movableHolidays.map((el) => el.toHoliday());
    } catch (error) {
      throw new BadRequestException('Invalid dates submitted.');
    }
  };

  getDatesWithAllHolidaysAndWeekends = (
    days: AbsencePeriodWithStatus,
    movableHolidays: Array<Holiday>,
    constantHolidays: Array<Holiday>,
  ): AbsencePeriodWithStatus => {
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
          if (constantHoliday.date.getTime() == dates[i].date.getTime()) {
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
  ): Promise<AbsencePeriodWithStatus> {
    const absenceStartAndEndDate = {
      startingDate,
      endingDate,
    }
    const datesBetween = DateUtil.getPeriodBetweenDates(absenceStartAndEndDate);
    const constantHolidays = await this.getConstantHolidaysForTheCurrentYear(absenceStartAndEndDate);
    const movableHolidays = await this.getMovableHolidaysForTheCurrentYear(absenceStartAndEndDate);

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
