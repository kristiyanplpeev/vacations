import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { JwtAuthGuard } from '../google/guards';
import { HolidayPeriodDto } from './dto/holidays.dto';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  public async calculateHolidayPeriod(
    @Body() body: HolidayPeriodDto,
  ): Promise<any> {
    return await this.holidaysService.calculateDays(body);
  }
}
