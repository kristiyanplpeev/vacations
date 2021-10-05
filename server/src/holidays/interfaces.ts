import { AbsenceTypesEnum } from '../common/constants';
import { Userdb } from '../model/user.entity';

export interface AbsencePeriod {
  startingDate: Date;
  endingDate: Date;
}

export type AbsencePeriodEachDay = Array<{ date: Date; status: string }>;

export interface Absence {
  id: string;
  type: AbsenceTypesEnum;
  from_date: Date;
  to_date: Date;
  comment: string;
  employee: Userdb;
}

export interface AbsenceDetailsOptional {
  id?: string;
  type: AbsenceTypesEnum;
  startingDate: Date;
  endingDate?: Date;
  comment?: string | null;
}

export interface AbsenceDetailsWithEachDay extends Absence {
  eachDayStatus: AbsencePeriodEachDay;
}

export interface AbsenceDetailsWithTotalDays extends Absence {
  totalDays: number;
  workingDays: number;
}

export interface Holiday {
  id: string;
  date: Date;
  movable: boolean;
  comment: string;
}
