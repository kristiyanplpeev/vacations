import { Injectable } from '@nestjs/common';
import { Holiday } from '../model/holiday.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HolidayInfoDto, HolidayPeriodDto } from './dto/holidays.dto';
import { HolidayPeriod, HolidaysDaysStatus } from 'src/holidays/types';
import { PTO } from '../model/pto.entity';
import { User } from '../model/user.entity';
import { ErrorMessage } from '../utils/types';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday) private holidayRepo: Repository<Holiday>,
    @InjectRepository(PTO) private PTORepo: Repository<PTO>,
    @InjectRepository(User) private userRepo: Repository<User>,
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
  ): Promise<Holiday[] | ErrorMessage> => {
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
      return { message: 'Invalid dates submitted.' };
    }
  };

  getMovableHolidaysForTheCurrentYear = async (
    holidayPeriod: HolidayPeriod,
  ): Promise<Holiday[] | ErrorMessage> => {
    try {
      const movableHolidays = await this.holidayRepo.find({
        movable: true,
        date: Between(holidayPeriod.startingDate, holidayPeriod.endingDate),
      });

      return movableHolidays;
    } catch (error) {
      return { message: 'Invalid dates submitted.' };
    }
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

  public async calculateDays(
    holidayPeriod: HolidayPeriodDto,
  ): Promise<HolidaysDaysStatus | ErrorMessage> {
    const holidayPeriodAsString = {
      startingDate: holidayPeriod.startingDate.toString(),
      endingDate: holidayPeriod.endingDate.toString(),
    };
    const datesBetween = this.getDatesBetweenDates(holidayPeriodAsString);
    const constantHolidays = await this.getConstantHolidaysForTheCurrentYear(
      holidayPeriodAsString,
    );
    if (!Array.isArray(constantHolidays) && 'message' in constantHolidays) {
      return constantHolidays;
    }

    const movableHolidays = await this.getMovableHolidaysForTheCurrentYear(
      holidayPeriodAsString,
    );

    if (!Array.isArray(movableHolidays) && 'message' in movableHolidays) {
      return movableHolidays;
    }
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

  saveHolidayIntoPTO = async (
    holidayInfo: HolidayInfoDto,
    user: User,
  ): Promise<PTO | ErrorMessage> => {
    try {
      const approversProm = holidayInfo.approvers.map(async (el) => {
        return await this.userRepo.findOne({ email: el });
      });
      const approvers = await Promise.all(approversProm);
      const approoversValidation = approvers.indexOf(undefined);
      if (approoversValidation >= 0) {
        return {
          message: `User with email ${holidayInfo.approvers[approoversValidation]} does not exist.`,
        };
      }

      const employee = this.userRepo.create(user);
      const newHoliday = this.PTORepo.create({
        from_date: holidayInfo.startingDate.toString(),
        to_date: holidayInfo.endingDate.toString(),
        comment: holidayInfo.comment,
        status: 'requested',
        employee,
        approvers,
      });
      return await this.PTORepo.save(newHoliday);
    } catch (error) {
      return {
        message: 'Something went wrong with saving PTO into the database.',
      };
    }
  };

  validateHolidayPeriod = async (
    holidayInfo: HolidayInfoDto,
    user: User,
  ): Promise<ErrorMessage | void> => {
    if (holidayInfo.startingDate > holidayInfo.endingDate) {
      return { message: 'The first date must not be after the last date!' };
    }

    const vacationDays = await this.calculateDays({
      startingDate: holidayInfo.startingDate,
      endingDate: holidayInfo.endingDate,
    });

    if ('message' in vacationDays) {
      return { message: vacationDays.message };
    }

    let isThereAWorkdayInSubmittedPeriod = false;

    for (let i = 0; i < vacationDays.length; i++) {
      if (vacationDays[i].status === 'workday') {
        isThereAWorkdayInSubmittedPeriod = true;
        break;
      }
    }
    if (!isThereAWorkdayInSubmittedPeriod) {
      return { message: 'There are not working days in the submitted period.' };
    }

    const employeeHolidays = await this.PTORepo.find({
      where: [
        { employee: user.id, status: 'requested' },
        { employee: user.id, status: 'approved' },
      ],
    });

    let overlapIndex = -1;

    for (let i = 0; i < employeeHolidays.length; i++) {
      if (
        !(
          holidayInfo.endingDate < employeeHolidays[i].from_date ||
          holidayInfo.startingDate > employeeHolidays[i].to_date
        )
      ) {
        overlapIndex = i;
        break;
      }
    }
    if (overlapIndex >= 0) {
      return {
        message: `The period you submitted is overlaping with another vacation from ${employeeHolidays[overlapIndex].from_date} to ${employeeHolidays[overlapIndex].to_date}`,
      };
    }
  };

  public async postHoliday(
    holidayInfo: HolidayInfoDto,
    user: User,
  ): Promise<PTO | ErrorMessage> {
    const invalidPeriodMessage = await this.validateHolidayPeriod(
      holidayInfo,
      user,
    );

    if (invalidPeriodMessage && 'message' in invalidPeriodMessage) {
      return invalidPeriodMessage;
    }
    return await this.saveHolidayIntoPTO(holidayInfo, user);
  }
}
