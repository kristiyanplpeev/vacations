import { Exclude, Expose, Transform } from 'class-transformer';
import { IsDateString, IsString, IsUUID } from 'class-validator';
import DateUtil from '../../utils/DateUtil';
import { AbsenceTypesEnum } from '../../common/constants';
import { AbsencePeriodWithStatus } from '../../holidays/interfaces';
import { Userdb } from '../../model/user.entity';

export class AbsenceTypeDto {
  type: AbsenceTypesEnum;
}

export class AbsencePeriodDto extends AbsenceTypeDto {
  startingDate: string;
  endingDate?: string;
}
export class AbsenceDetailsDto extends AbsencePeriodDto {
  comment?: string;
}
export class GetByIdDto {
  @IsUUID('all', { message: 'Invalid PTO id' })
  id: string;
}

export class EditPTODto extends AbsenceDetailsDto {
  @IsUUID('all', { message: 'PTO id is invalid' })
  id: string;
}

export class PTOResponseDto {
  id: string;
  type: string;
  @Transform(({ value }) => DateUtil.dateToString(value))
  from_date: string;
  @Transform(({ value }) => DateUtil.dateToString(value))
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
  @Transform(({ value }) => DateUtil.dateToString(value))
  from_date: string;
  @Transform(({ value }) => DateUtil.dateToString(value))
  to_date: string;
  comment: string;
  id: string;
}

export class PTOWithEachDay extends PTOResponseDto {
  eachDayStatus: AbsencePeriodWithStatus;
}
