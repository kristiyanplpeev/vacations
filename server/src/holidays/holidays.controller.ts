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
  ): Promise<HolidaysDaysStatus> {
    return await this.holidaysService.calculateDays(body);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async postHoliday(
    @Body() body: HolidayInfoDto,
    @Req() req,
    @Res() res,
  ): Promise<PTO | QueryFail> {
    const newHoliday = await this.holidaysService.postHoliday(body, req.user);
    if (typeof newHoliday === 'string') {
      return res.status(400).send({
        statusCode: 400,
        message: newHoliday,
        error: 'Bad Request',
      });
    } else {
      return newHoliday;
    }
  }
}
