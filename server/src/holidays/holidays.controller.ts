import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { JwtAuthGuard } from '../google/guards';
import { HolidayInfoDto, HolidayPeriodDto } from './dto/holidays.dto';
import { HolidaysDaysStatus } from 'src/holidays/types';
import { QueryFail } from 'src/utils/types';
import { PTO } from 'src/model/pto.entity';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

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
      const newHoliday = await this.holidaysService.postHoliday(body, req.user);
      return res.status(200).send(newHoliday);
    } catch (error) {
      return res.status(400).send({
        statusCode: 400,
        message: error.message,
        error: 'Bad Request',
      });
    }
  }
}
