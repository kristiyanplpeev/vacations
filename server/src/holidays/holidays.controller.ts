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
    const vacationDays = await this.holidaysService.calculateDays(body);
    if ('message' in vacationDays) {
      return res.status(400).send({
        statusCode: 400,
        message: vacationDays.message,
        error: 'Bad Request',
      });
    } else {
      return res.status(200).send(vacationDays);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async postHoliday(
    @Body() body: HolidayInfoDto,
    @Req() req,
    @Res() res,
  ): Promise<PTO | QueryFail> {
    const newHoliday = await this.holidaysService.postHoliday(body, req.user);
    if ('message' in newHoliday) {
      return res.status(400).send({
        statusCode: 400,
        message: newHoliday.message,
        error: 'Bad Request',
      });
    } else {
      return res.status(200).send(newHoliday);
    }
  }
}
