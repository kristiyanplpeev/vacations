import { Injectable } from '@nestjs/common';
import { Holiday } from '../model/holiday.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HolidayPeriodDto } from './dto/holidays.dto';
import { HolidayPeriod } from 'holidays/types';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday) private userRepo: Repository<Holiday>,
  ) {}

  getDatesBetweenDates = ({ startingDate, endingDate }: HolidayPeriod) => {
    let dates = [];

    const theStartDate = new Date(startingDate);
    const theEndDate = new Date(endingDate);
    while (theStartDate <= theEndDate) {
      const year = new Date(theStartDate).getFullYear().toString();
      let month = (new Date(theStartDate).getMonth() + 1).toString();
      let day = new Date(theStartDate).getDate().toString();
      month = month.length === 1 ? `0${month}` : month;
      day = day.length === 1 ? `0${day}` : day;
      dates = [...dates, `${year}-${month}-${day}`];
      theStartDate.setDate(theStartDate.getDate() + 1);
    }
    return dates;
  };

  getConstantHolidaysForTheCurrentYear = async (
    holidayPeriod: HolidayPeriod,
  ): Promise<Holiday[]> => {
    const constantHolidays = await this.userRepo.find({
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
  };

  getMovableHolidaysForTheCurrentYear = async (
    holidayPeriod: HolidayPeriod,
  ): Promise<Holiday[]> => {
    const movableHolidays = await this.userRepo.find({
      movable: true,
      date: Between(holidayPeriod.startingDate, holidayPeriod.endingDate),
    });

    return movableHolidays;
  };

  getDatesWithAllHolidaysAndWeekends = (
    datesBetweenAsObj: {
      date: string;
      status: string;
    }[],
    movableHolidays: Holiday[],
    constantHolidays: Holiday[],
  ): {
    date: string;
    status: string;
  }[] => {
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

  public async calculateDays(holidayPeriod: HolidayPeriodDto): Promise<any> {
    const holidayPeriodAsString = {
      startingDate: holidayPeriod.startingDate.toString(),
      endingDate: holidayPeriod.endingDate.toString(),
    };
    console.log(holidayPeriodAsString);
    const datesBetween = this.getDatesBetweenDates(holidayPeriodAsString);
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
  }
}
