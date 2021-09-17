import {
  IsDateString,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { HolidaysDaysStatus } from '../../holidays/interfaces';
import { Userdb } from '../../model/user.entity';

export class HolidayPeriodDto {
  @IsDateString({}, { message: 'The submitted starting date is invalid.' })
  startingDate: string;

  @IsDateString({}, { message: 'The submitted ending date is invalid.' })
  endingDate: string;
}

export class getPTObyIdDto {
  @IsUUID('all', { message: 'Invalid PTO id' })
  id: string;
}

export class HolidayInfoDto extends HolidayPeriodDto {
  @IsString()
  @MaxLength(1000)
  @MinLength(1)
  comment: string;
}

export class EditPTODto extends HolidayInfoDto {
  @IsUUID('all', { message: 'PTO id is invalid' })
  id: string;
}

export class PTOResponseDto {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  employee: Userdb;
}

export class PTODaysStatusResponseDto {
  date: string;
  status: string;
}

export class PTOWithTotalDaysResponseDto {
  totalDays: number;
  PTODays: number;
  from_date: string;
  to_date: string;
  comment: string;
  id: string;
}

export class PTOWithEachDay extends PTOResponseDto {
  eachDayStatus: HolidaysDaysStatus;
}
