import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Absencedb } from '../model/absence.entity';
import { Userdb } from '../model/user.entity';
import { Repository } from 'typeorm';
import { EditPTODto } from './dto/holidays.dto';
import { HolidaysService } from './holidays.service';
import {
  PTODetailsWithTotalDays,
  PTODetailsWithEachDay,
  PTO,
  AbsenceDetails,
} from './interfaces';
import { DayStatus, UserRelations } from '../common/constants';
import Guard from '../utils/Guard';
import { User } from '../google/utils/interfaces';
import DateUtil from '../utils/DateUtil';
import { AbsenceBehaviourFactory } from '../holidays/absenceBehaviour/absenceBehaviour';

@Injectable()
export class PTOsService {
  constructor(
    @InjectRepository(Absencedb) private PTORepo: Repository<Absencedb>,
    @InjectRepository(Userdb) private userRepo: Repository<Userdb>,
    private readonly holidaysService: HolidaysService,
  ) {}

  saveHolidayIntoPTO = async (
    holidayInfo: AbsenceDetails,
    user: User,
  ): Promise<PTO> => {
    const employee = this.userRepo.create(user);
    const newHoliday = this.PTORepo.create({
      type: holidayInfo.type,
      from_date: DateUtil.dateToString(holidayInfo.startingDate),
      to_date: DateUtil.dateToString(holidayInfo.endingDate),
      comment: holidayInfo.comment,
      employee,
    });
    return (await this.PTORepo.save(newHoliday)).toPTO();
  };

  // validatePTOPeriod = async (
  //   holidayInfo: AbsenceDetails,
  //   user: User,
  // ): Promise<void> => {
  //   if (holidayInfo.startingDate > holidayInfo.endingDate) {
  //     throw new BadRequestException(
  //       'The first date must not be after the last date!',
  //     );
  //   }

  //   const vacationDays = await this.holidaysService.calculateDays({
  //     startingDate: holidayInfo.startingDate,
  //     endingDate: holidayInfo.endingDate,
  //   });

  //   let isThereAWorkdayInSubmittedPeriod = false;

  //   for (let i = 0; i < vacationDays.length; i++) {
  //     if (vacationDays[i].status === DayStatus.workday) {
  //       isThereAWorkdayInSubmittedPeriod = true;
  //       break;
  //     }
  //   }
  //   if (!isThereAWorkdayInSubmittedPeriod) {
  //     throw new BadRequestException(
  //       'There are not working days in the submitted period.',
  //     );
  //   }

  //   const allEmployeeHolidays = await this.PTORepo.find({
  //     where: [{ employee: user.id }],
  //   });

  //   //remove currently edited PTO from the validation
  //   const employeeHolidays = allEmployeeHolidays
  //     .filter((el) => el.id !== holidayInfo.id)
  //     .map((el) => ({
  //       ...el,
  //       from_date: new Date(el.from_date),
  //       to_date: new Date(el.to_date),
  //     }));

  //   let overlapIndex = -1;

  //   for (let i = 0; i < employeeHolidays.length; i++) {
  //     if (
  //       !(
  //         holidayInfo.endingDate < employeeHolidays[i].from_date ||
  //         holidayInfo.startingDate > employeeHolidays[i].to_date
  //       )
  //     ) {
  //       overlapIndex = i;
  //       break;
  //     }
  //   }
  //   if (overlapIndex >= 0) {
  //     throw new BadRequestException(
  //       `The period you submitted is overlapping with another vacation from ${employeeHolidays[overlapIndex].from_date} to ${employeeHolidays[overlapIndex].to_date}`,
  //     );
  //   }
  // };

  validateEditPTO(PTO: PTO, user: User, PTOEdited: EditPTODto): void {
    Guard.exists(PTO, `PTO with id ${PTOEdited.id} does not exist.`);

    if (user.id !== PTO.employee.id) {
      throw new UnauthorizedException('Only the owner of the PTO can edit it.');
    }
  }

  public async postAbsence(
    holidayInfo: AbsenceDetails,
    user: User,
  ): Promise<PTO> {
    const userAbsences = await this.getUserPTOs(user);

    const absence = AbsenceBehaviourFactory.create(
      holidayInfo,
      userAbsences,
      (startingDate: Date, endingDate: Date) => this.holidaysService.calculateDays(startingDate, endingDate),
    );
    await absence.validate();
    const absenceValue = await absence.getAbsenceDetails();
    return await this.saveHolidayIntoPTO(absenceValue, user);
  }

  public async getUserPTOs(
    user: User,
  ): Promise<Array<PTODetailsWithTotalDays>> {
    Guard.isValidUUID(user.id, `Invalid user id: ${user.id}`);
    const userHolidays = await this.PTORepo.find({
      where: { employee: user.id },
      relations: [UserRelations.employee],
    });

    const userHolidaysWithCalculatedPTOs = userHolidays
      .map((el) => el.toPTO())
      .map(async (el) => {
        const eachDayStatus = await this.holidaysService.calculateDays(
          el.from_date,
          el.to_date,
        );
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
    const PTO = await this.PTORepo.findOne({
      where: { id: PTOId },
      relations: [UserRelations.employee],
    });
    Guard.exists(PTO, `PTO with id ${PTOId} does not exist.`);
    return PTO.toPTO();
  }

  public async getPTOById(PTOId: string): Promise<PTODetailsWithEachDay> {
    const PTOInfo = await this.getPTOFullInfo(PTOId);
    const eachDayStatus = await this.holidaysService.calculateDays(
      PTOInfo.from_date,
      PTOInfo.to_date,
    );
    const PTOInfoWithEachDayStatus = { ...PTOInfo, eachDayStatus };
    return PTOInfoWithEachDayStatus;
  }

  public async getRequestedPTOById(PTOId: string): Promise<PTO> {
    const PTODetails = await this.getPTOFullInfo(PTOId);
    return PTODetails;
  }

  public async editPTO(PTOEdited: EditPTODto, user: User): Promise<PTO> {
    const PTOdb = await this.PTORepo.findOne({
      where: { id: PTOEdited.id },
      relations: [UserRelations.employee],
    });
    const PTO = PTOdb.toPTO();
    this.validateEditPTO(PTO, user, PTOEdited);

    PTOdb.from_date = PTOEdited.startingDate;
    PTOdb.to_date = PTOEdited.endingDate;
    PTOdb.comment = PTOEdited.comment;

    return (await this.PTORepo.save(PTOdb)).toPTO();
  }
}
