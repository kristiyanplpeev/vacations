import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { HolidaysDaysStatus } from '../../holidays/interfaces';
import { PTOStatus } from '../../common/constants';
import { Userdb } from '../../model/user.entity';

export class HolidayPeriodDto {
  @IsDateString({}, { message: 'The submitted starting date is invalid.' })
  startingDate: string;

  @IsDateString({}, { message: 'The submitted ending date is invalid.' })
  endingDate: string;
}

export class HolidayInfoDto extends HolidayPeriodDto {
  @IsString()
  @MaxLength(1000)
  @MinLength(1)
  comment: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'You must provide at least one approver' })
  @IsEmail(
    {},
    {
      each: true,
      message: 'Approvers must be valid emails separated with comma.',
    },
  )
  approvers: Array<string>;
}

export class EditPTODto extends HolidayInfoDto {
  @IsString()
  id: string;
}

export class PTOResponseDto {
  id: string;
  from_date: string;
  to_date: string;
  comment: string;
  status: PTOStatus;
  employee: Userdb;
  approvers: Array<Userdb>;
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
  status: PTOStatus;
  id: string;
}

export class PTOWithEachDay extends PTOResponseDto {
  eachDayStatus: HolidaysDaysStatus;
}
