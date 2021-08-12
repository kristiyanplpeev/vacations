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
