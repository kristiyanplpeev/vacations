import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { PTOsService } from './pto.service';
import { JwtAuthGuard } from '../google/guards';
import { HolidayInfoDto, HolidayPeriodDto } from './dto/holidays.dto';
import { HolidaysDaysStatus, PTOFullInfo } from 'src/holidays/types';
import { QueryFail } from 'src/utils/types';
import { PTO } from 'src/model/pto.entity';

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
    @Res() res,
  ): Promise<HolidaysDaysStatus | QueryFail> {
    try {
      const vacationDays = await this.holidaysService.calculateDays(body);
      return res.status(200).send(vacationDays);
    } catch (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
        error: 'Bad Request',
      });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async postHoliday(
    @Body() body: HolidayInfoDto,
    @Req() req,
    @Res() res,
  ): Promise<PTO | QueryFail> {
    try {
      const newHoliday = await this.PTOService.postPTO(body, req.user);
      return res.status(200).send(newHoliday);
    } catch (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
        error: 'Bad Request',
      });
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  public async getUserPTOs(@Req() req, @Res() res): Promise<void> {
    try {
      const userPTOs = await this.PTOService.getUserPTOs(req.user);
      return res.status(200).send(userPTOs);
    } catch (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
        error: 'Bad Request',
      });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getPTOById(
    @Param('id') id: string,
    @Res() res,
  ): Promise<PTOFullInfo | QueryFail> {
    try {
      const PTOInfo = await this.PTOService.getPTOById(id);
      return res.status(200).send(PTOInfo);
    } catch (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
        error: 'Bad Request',
      });
    }
  }
}
