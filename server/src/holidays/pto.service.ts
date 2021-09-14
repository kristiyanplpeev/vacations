import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PTOdb } from '../model/pto.entity';
import { Userdb } from '../model/user.entity';
import { Repository } from 'typeorm';
import { EditPTODto, HolidayInfoDto } from './dto/holidays.dto';
import { HolidaysService } from './holidays.service';
import {
  PTODetails,
  PTODetailsWithTotalDays,
  PTODetailsWithEachDay,
  PTO,
} from './interfaces';
import { DayStatus, PTOStatus, UserRelations } from '../common/constants';
import Guard from '../utils/Guard';
import { User } from 'src/google/utils/interfaces';

@Injectable()
export class PTOsService {
  constructor(
    @InjectRepository(PTOdb) private PTORepo: Repository<PTOdb>,
    @InjectRepository(Userdb) private userRepo: Repository<Userdb>,
    private readonly holidaysService: HolidaysService,
  ) {}

  private async validateApprovers(
    approvers: Array<string>,
  ): Promise<Array<Userdb>> {
    const approversProm = approvers.map(async (el) => {
      return await this.userRepo.findOne({ email: el });
    });
    const approversResolved = await Promise.all(approversProm);
    const approversValidation = approversResolved.indexOf(undefined);
    if (approversValidation >= 0) {
      throw new BadRequestException(
        `User with email ${approvers[approversValidation]} does not exist.`,
      );
    }
    return approversResolved;
  }

  saveHolidayIntoPTO = async (
    holidayInfo: HolidayInfoDto,
    user: User,
  ): Promise<PTO> => {
    const approvers = await this.validateApprovers(holidayInfo.approvers);

    const employee = this.userRepo.create(user);
    const newHoliday = this.PTORepo.create({
      from_date: holidayInfo.startingDate.toString(),
      to_date: holidayInfo.endingDate.toString(),
      comment: holidayInfo.comment,
      status: PTOStatus.requested,
      employee,
      approvers,
    });
    return (await this.PTORepo.save(newHoliday)).toPTO();
  };

  validatePTOPeriod = async (
    holidayInfo: PTODetails,
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

    const allEmployeeHolidays = await this.PTORepo.find({
      where: [
        { employee: user.id, status: PTOStatus.requested },
        { employee: user.id, status: PTOStatus.approved },
      ],
    });

    //remove currently edited PTO from the validation
    const employeeHolidays = allEmployeeHolidays.filter(
      (el) => el.id !== holidayInfo.id,
    );

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
        `The period you submitted is overlapping with another vacation from ${employeeHolidays[overlapIndex].from_date} to ${employeeHolidays[overlapIndex].to_date}`,
      );
    }
  };

  validateEditPTO(PTO: PTO, user: User, PTOEdited: EditPTODto): void {
    Guard.exists(PTO, `PTO with id ${PTOEdited.id} does not exist.`);

    if (user.id !== PTO.employee.id) {
      throw new UnauthorizedException('Only the owner of the PTO can edit it.');
    }

    Guard.should(
      PTO.status === PTOStatus.requested,
      "You can't edit approved or rejected PTOs.",
    );
  }

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
    const PTO = await this.PTORepo.findOne({
      where: { id: PTOId },
      relations: [UserRelations.employee, UserRelations.approvers],
    });
    Guard.exists(PTO, `PTO with id ${PTOId} does not exist.`);
    return PTO.toPTO();
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

  public async getRequestedPTOById(PTOId: string): Promise<PTO> {
    const PTODetails = await this.getPTOFullInfo(PTOId);
    return PTODetails;
  }

  public async editPTO(PTOEdited: EditPTODto, user: User): Promise<PTO> {
    const PTO = await this.PTORepo.findOne({
      where: { id: PTOEdited.id },
      relations: [UserRelations.approvers, UserRelations.employee],
    });
    this.validateEditPTO(PTO, user, PTOEdited);
    await this.validatePTOPeriod(PTOEdited, user);
    const approvers = await this.validateApprovers(PTOEdited.approvers);

    PTO.from_date = PTOEdited.startingDate;
    PTO.to_date = PTOEdited.endingDate;
    PTO.comment = PTOEdited.comment;
    PTO.approvers = approvers;

    return (await this.PTORepo.save(PTO)).toPTO();
  }
}
