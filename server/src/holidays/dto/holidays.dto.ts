import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class HolidayPeriodDto {
  startingDate: Date;

  endingDate: Date;
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
