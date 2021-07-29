import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class HolidayPeriodDto {
  @IsDateString()
  startingDate: string;

  @IsDateString()
  endingDate: string;
}

export class HolidayInfoDto extends HolidayPeriodDto {
  @IsString()
  @MaxLength(1000)
  @MinLength(1)
  comment: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  approvers: string[];
}
