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
import { PTOsService } from './pto.service';
import { JwtAuthGuard } from '../google/guards';
import {
  EditPTODto,
  getPTObyIdDto,
  HolidayInfoDto,
  HolidayPeriodDto,
  PTODaysStatusResponseDto,
  PTOResponseDto,
  PTOWithEachDay,
  PTOWithTotalDaysResponseDto,
} from './dto/holidays.dto';
import { plainToClass } from 'class-transformer';

@Controller('holidays')
export class HolidaysController {
  constructor(
    private readonly holidaysService: HolidaysService,
    private readonly PTOService: PTOsService,
  ) {}

  @Post('calc')
  @UseGuards(JwtAuthGuard)
  public async calculateHolidayPeriod(
    @Body() body: HolidayPeriodDto,
  ): Promise<Array<PTODaysStatusResponseDto>> {
    const daysWithStatus = await this.holidaysService.calculateDays(body);
    return plainToClass(PTODaysStatusResponseDto, daysWithStatus);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async postHoliday(
    @Body() body: HolidayInfoDto,
    @Req() req,
  ): Promise<PTOResponseDto> {
    const postedPTO = await this.PTOService.postPTO(body, req.user);
    return plainToClass(PTOResponseDto, postedPTO);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  public async getUserPTOs(
    @Req() req,
  ): Promise<Array<PTOWithTotalDaysResponseDto>> {
    const userPTOs = await this.PTOService.getUserPTOs(req.user);
    return plainToClass(PTOWithTotalDaysResponseDto, userPTOs);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getPTOById(
    @Param() params: getPTObyIdDto,
  ): Promise<PTOWithEachDay> {
    const PTO = await this.PTOService.getPTOById(params.id);
    return plainToClass(PTOWithEachDay, PTO);
  }

  @Get('details/:id')
  @UseGuards(JwtAuthGuard)
  public async getRequestedPTOById(
    @Param() params: getPTObyIdDto,
  ): Promise<PTOResponseDto> {
    const PTO = await this.PTOService.getRequestedPTOById(params.id);
    return plainToClass(PTOResponseDto, PTO);
  }

  @Post('edit')
  @UseGuards(JwtAuthGuard)
  public async editPTO(
    @Body() body: EditPTODto,
    @Req() req,
  ): Promise<PTOResponseDto> {
    const editedPTO = await this.PTOService.editPTO(body, req.user);
    return plainToClass(PTOResponseDto, editedPTO);
  }
}
