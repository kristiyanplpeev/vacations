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
import { HolidayInfoDto, HolidayPeriodDto } from './dto/holidays.dto';
import { HolidaysDaysStatus, PTOFullInfo } from 'src/holidays/types';
import { QueryFail } from 'src/utils/types';
import { PTO } from 'src/model/pto.entity';
import { PTOInfo } from '../utils/types';

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
  ): Promise<HolidaysDaysStatus | QueryFail> {
    return await this.holidaysService.calculateDays(body);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async postHoliday(
    @Body() body: HolidayInfoDto,
    @Req() req,
  ): Promise<PTO> {
    return await this.PTOService.postPTO(body, req.user);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  public async getUserPTOs(@Req() req): Promise<Array<PTOInfo>> {
    return await this.PTOService.getUserPTOs(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getPTOById(@Param('id') id: string): Promise<PTOFullInfo> {
    return await this.PTOService.getPTOById(id);
  }
}
