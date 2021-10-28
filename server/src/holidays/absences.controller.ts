import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { AbsencesService } from './absence.service';
import { JwtAuthGuard } from '../google/guards';
import {
  GetByIdDto,
  AbsenceDetailsDto,
  AbsenceDaysStatusResponseDto,
  AbsenceResponseDto,
  AbsenceWithEachDay,
  AbsenceWithWorkingDaysResponseDto,
  EndingDateResponseDto,
  AbsenceTypeDto,
  AbsencePeriodWithEndDateDto,
  AbsenceStartingDateDto,
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

@Controller('absences')
export class AbsencesController {
  constructor(
    private readonly holidaysService: HolidaysService,
    private readonly absenceService: AbsencesService,
    private readonly absenceFactory: AbsenceFactory,
  ) {}

  @Get('dates')
  @UseGuards(JwtAuthGuard)
  public async calculateHolidayPeriod(
    @Query() query: AbsencePeriodWithEndDateDto,
  ): Promise<Array<AbsenceDaysStatusResponseDto>> {
    const daysWithStatus = await this.holidaysService.calculateDays(
      new Date(query.from),
      new Date(query.to),
    );
    return plainToClass(AbsenceDaysStatusResponseDto, daysWithStatus);
  }

  @Get(':type/end-date')
  @UseGuards(JwtAuthGuard)
  public async getEndDate(
    @Param() params: AbsenceTypeDto,
    @Query() query: AbsenceStartingDateDto,
  ): Promise<EndingDateResponseDto> {
    const absenceDetails = {
      type: params.type,
      startingDate: new Date(query.from),
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
  ): Promise<string> {
    const absenceDetails = convertDatesInBody(body);
    const absence = this.absenceFactory.create(absenceDetails);
    return await this.absenceService.postAbsence(absence, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async getUserAbsences(
    @Req() req,
  ): Promise<Array<AbsenceWithWorkingDaysResponseDto>> {
    const userAbsences = await this.absenceService.getUserAbsences(req.user);
    return plainToClass(AbsenceWithWorkingDaysResponseDto, userAbsences);
  }

  @Get('team')
  @UseGuards(JwtAuthGuard)
  public async getByTeam(@Req() req): Promise<string | AbsenceResponseDto> {
    const userAbsences = await this.absenceService.getAllUsersAbsencesByTeam(
      req.user,
    );
    return plainToClass(AbsenceResponseDto, userAbsences);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getAbsenceWithEachDay(
    @Param() params: GetByIdDto,
  ): Promise<AbsenceWithEachDay> {
    const absence = await this.absenceService.getAbsenceWithEachDayStatus(
      params.id,
    );
    return plainToClass(AbsenceWithEachDay, absence);
  }

  @Get(':id/details')
  @UseGuards(JwtAuthGuard)
  public async getAbsenceDetailsById(
    @Param() params: GetByIdDto,
  ): Promise<AbsenceResponseDto> {
    const absence = await this.absenceService.getAbsenceDetailsById(params.id);
    return plainToClass(AbsenceResponseDto, absence);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async editAbsence(
    @Param() params: GetByIdDto,
    @Body() body: AbsenceDetailsDto,
    @Req() req,
  ): Promise<string> {
    const editedAbsence = convertDatesInBody(body);
    const absence = this.absenceFactory.create({
      id: params.id,
      ...editedAbsence,
    });

    return await this.absenceService.editAbsence(absence, req.user, params.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteAbsence(
    @Param() params: GetByIdDto,
    @Req() req,
  ): Promise<string> {
    return await this.absenceService.deleteAbsence(req.user, params.id);
  }
}
