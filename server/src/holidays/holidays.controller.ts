import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { AbsencesService } from './absence.service';
import { JwtAuthGuard } from '../google/guards';
import {
  EditAbsenceDto,
  GetByIdDto,
  AbsenceDetailsDto,
  AbsenceDaysStatusResponseDto,
  AbsenceResponseDto,
  AbsenceWithEachDay,
  AbsenceWithWorkingDaysResponseDto,
  AbsencePeriodWithEndDateDto,
  AbsenceStartingDateDto,
  EndingDateResponseDto,
} from './dto/holidays.dto';
import { plainToClass } from 'class-transformer';
import { AbsenceDetailsOptional } from './interfaces';
import { AbsenceFactory } from './absenceTypes/absenceTypes';
import Guard from '../utils/Guard';

const convertDatesInBody = (body: any): AbsenceDetailsOptional => {
  return {
    ...body,
    startingDate: new Date(body.startingDate),
    ...(body.endingDate && { endingDate: new Date(body.endingDate) }),
  };
};

@Controller('holidays')
export class HolidaysController {
  constructor(
    private readonly holidaysService: HolidaysService,
    private readonly absenceService: AbsencesService,
    private readonly absenceFactory: AbsenceFactory,
  ) {}

  @Get('calc/:start/:end')
  @UseGuards(JwtAuthGuard)
  public async calculateHolidayPeriod(
    @Param() params: AbsencePeriodWithEndDateDto,
  ): Promise<Array<AbsenceDaysStatusResponseDto>> {
    const daysWithStatus = await this.holidaysService.calculateDays(
      new Date(params.start),
      new Date(params.end),
    );
    return plainToClass(AbsenceDaysStatusResponseDto, daysWithStatus);
  }

  @Get('end/:type/:start')
  @UseGuards(JwtAuthGuard)
  public async getEndDate(
    @Param() params: AbsenceStartingDateDto,
  ): Promise<EndingDateResponseDto> {
    const absenceDetails = {
      type: params.type,
      startingDate: new Date(params.start),
    };

    const absence = this.absenceFactory.create(absenceDetails);
    const endingDate = await this.absenceService.getEndingDate(absence);

    return plainToClass(EndingDateResponseDto, { endingDate });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async postNewAbsence(
    @Body() body: AbsenceDetailsDto,
    @Req() req,
  ): Promise<AbsenceResponseDto> {
    const absenceDetails = convertDatesInBody(body);
    const absence = this.absenceFactory.create(absenceDetails);
    const postedAbsence = await this.absenceService.postAbsence(
      absence,
      req.user,
    );
    return plainToClass(AbsenceResponseDto, postedAbsence);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  public async getUserAbsences(
    @Req() req,
  ): Promise<Array<AbsenceWithWorkingDaysResponseDto>> {
    const userAbsences = await this.absenceService.getUserAbsences(req.user);
    return plainToClass(AbsenceWithWorkingDaysResponseDto, userAbsences);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getAbsenceDetailsWithEachDayStatus(
    @Param() params: GetByIdDto,
  ): Promise<AbsenceWithEachDay> {
    const absence = await this.absenceService.getAbsenceWithEachDayStatus(
      params.id,
    );
    return plainToClass(AbsenceWithEachDay, absence);
  }

  @Get('details/:id')
  @UseGuards(JwtAuthGuard)
  public async getAbsenceDetailsById(
    @Param() params: GetByIdDto,
  ): Promise<AbsenceResponseDto> {
    const absence = await this.absenceService.getAbsenceDetailsById(params.id);
    return plainToClass(AbsenceResponseDto, absence);
  }

  @Post('edit')
  @UseGuards(JwtAuthGuard)
  public async editAbsence(
    @Body() body: EditAbsenceDto,
    @Req() req,
  ): Promise<AbsenceResponseDto> {
    const editedAbsence = convertDatesInBody(body);
    const absence = this.absenceFactory.create(editedAbsence);

    const editedAbsenceFromDb = await this.absenceService.editAbsence(
      absence,
      req.user,
      editedAbsence.id,
    );
    return plainToClass(AbsenceResponseDto, editedAbsenceFromDb);
  }
}
