import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PTO } from '../model/pto.entity';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';
import { PTODetailsWithTotalDays } from './interfaces';
import { HolidayInfoDto } from './dto/holidays.dto';
import { PTODetailsWithEachDay } from './interfaces';
import { HolidaysService } from './holidays.service';
import { DayStatus, PTOStatus, UserRelations } from '../common/constants';

@Injectable()
export class PTOsService {
  constructor(
    @InjectRepository(PTO) private PTORepo: Repository<PTO>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly holidaysService: HolidaysService,
  ) {}

  saveHolidayIntoPTO = async (
    holidayInfo: HolidayInfoDto,
    user: User,
  ): Promise<PTO> => {
    const approversProm = holidayInfo.approvers.map(async (el) => {
      return await this.userRepo.findOne({ email: el });
    });
    const approvers = await Promise.all(approversProm);
    const approversValidation = approvers.indexOf(undefined);
    if (approversValidation >= 0) {
      throw new BadRequestException(
        `User with email ${holidayInfo.approvers[approversValidation]} does not exist.`,
      );
    }

    const employee = this.userRepo.create(user);
    const newHoliday = this.PTORepo.create({
      from_date: holidayInfo.startingDate.toString(),
      to_date: holidayInfo.endingDate.toString(),
      comment: holidayInfo.comment,
      status: PTOStatus.requested,
      employee,
      approvers,
    });
    return await this.PTORepo.save(newHoliday);
  };

  validatePTOPeriod = async (
    holidayInfo: HolidayInfoDto,
    user: User,
  ): Promise<void> => {
    if (holidayInfo.startingDate > holidayInfo.endingDate) {
      throw new BadRequestException(
        'The first date must not be after the last date!',
      );
    }

    const vacationDays = await this.holidaysService.calculateDays({
      startingDate: holidayInfo.startingDate,
      endingDate: holidayInfo.endingDate,
    });

    let isThereAWorkdayInSubmittedPeriod = false;

    for (let i = 0; i < vacationDays.length; i++) {
      if (vacationDays[i].status === DayStatus.workday) {
        isThereAWorkdayInSubmittedPeriod = true;
        break;
      }
    }
    if (!isThereAWorkdayInSubmittedPeriod) {
      throw new BadRequestException(
        'There are not working days in the submitted period.',
      );
    }

    const employeeHolidays = await this.PTORepo.find({
      where: [
        { employee: user.id, status: PTOStatus.requested },
        { employee: user.id, status: PTOStatus.approved },
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
      throw new BadRequestException(
        `The period you submitted is overlaping with another vacation from ${employeeHolidays[overlapIndex].from_date} to ${employeeHolidays[overlapIndex].to_date}`,
      );
    }
  };

  public async postPTO(holidayInfo: HolidayInfoDto, user: User): Promise<PTO> {
    await this.validatePTOPeriod(holidayInfo, user);
    return await this.saveHolidayIntoPTO(holidayInfo, user);
  }

  public async getUserPTOs(
    user: User,
  ): Promise<Array<PTODetailsWithTotalDays>> {
    const userHolidays = await this.PTORepo.find({
      where: { employee: user.id },
    });

    const userHolidaysWithCalculatedPTOs = userHolidays.map(async (el) => {
      const eachDayStatus = await this.holidaysService.calculateDays({
        startingDate: el.from_date,
        endingDate: el.to_date,
      });
      if (Array.isArray(eachDayStatus)) {
        const workDays = eachDayStatus.filter(
          (elem) => elem.status === DayStatus.workday,
        );
        return {
          ...el,
          totalDays: eachDayStatus.length,
          PTODays: workDays.length,
        };
      }
    });
    const resolvedHolidaysInfo = await Promise.all(
      userHolidaysWithCalculatedPTOs,
    );
    return resolvedHolidaysInfo;
  }

  private async getPTOFullInfo(PTOId: string): Promise<PTO> {
    return await this.PTORepo.findOne({
      where: { id: PTOId },
      relations: [UserRelations.employee, UserRelations.approvers],
    });
  }

  public async getPTOById(PTOId: string): Promise<PTODetailsWithEachDay> {
    const PTOInfo = await this.getPTOFullInfo(PTOId);
    const eachDayStatus = await this.holidaysService.calculateDays({
      startingDate: PTOInfo.from_date,
      endingDate: PTOInfo.to_date,
    });
    const PTOInfoWithEachDayStatus = { ...PTOInfo, eachDayStatus };
    return PTOInfoWithEachDayStatus;
  }
}
