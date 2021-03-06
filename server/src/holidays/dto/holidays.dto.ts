import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import DateUtil from '../../utils/DateUtil';
import {
  AbsenceTypesEnum,
  invalidDateFormatMessage,
} from '../../common/constants';
import { AbsencePeriodEachDay } from '../../holidays/interfaces';
import { Userdb } from '../../model/user.entity';

export class AbsenceTypeDto {
  type: AbsenceTypesEnum;
}

export class AbsenceStartingDateDto {
  @IsDateString({}, { message: invalidDateFormatMessage })
  from: string;
}

export class SprintPeriodDto {
  @IsDateString({}, { message: invalidDateFormatMessage })
  @IsOptional()
  sprintStart?: string;

  @IsDateString({}, { message: invalidDateFormatMessage })
  @IsOptional()
  sprintEnd?: string;
}

export class AbsencePeriodWithEndDateDto extends AbsenceStartingDateDto {
  @IsDateString({}, { message: invalidDateFormatMessage })
  to: string;
}

export class AbsencePeriodDto extends AbsenceTypeDto {
  @IsDateString({}, { message: invalidDateFormatMessage })
  startingDate: string;

  @IsOptional()
  @IsDateString({}, { message: invalidDateFormatMessage })
  endingDate?: string;
}
export class AbsenceDetailsDto extends AbsencePeriodDto {
  @IsOptional()
  @MaxLength(1000)
  @MinLength(1)
  @IsString()
  comment?: string;
}
export class GetByIdDto {
  @IsUUID('all', { message: 'Invalid absence id' })
  id: string;
}


export class AbsenceResponseDto {
  id: string;
  type: string;
  @Transform(({ value }) => DateUtil.dateToString(value))
  startingDate: string;
  @Transform(({ value }) => DateUtil.dateToString(value))
  endingDate: string;
  comment: string;
  @Exclude()
  isDeleted: boolean;
  employee: Userdb;
}

export class AbsenceDaysStatusResponseDto {
  @Transform(({ value }) => DateUtil.dateToString(value))
  date: string;
  status: string;
}

export class AbsenceWithWorkingDaysResponseDto extends AbsenceResponseDto {
  totalDays: number;
  workingDays: number;
}

export class AbsenceWithEachDay extends AbsenceResponseDto {
  eachDayStatus: AbsencePeriodEachDay;
}

export class EndingDateResponseDto {
  @Transform(({ value }) => DateUtil.dateToString(value))
  endingDate: string;
}
