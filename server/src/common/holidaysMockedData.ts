import { Absence, Holiday } from '../holidays/interfaces';
import {
  AbsenceTypesEnum,
  DayStatus,
  PositionsEnum,
  TeamsEnum,
} from '../common/constants';

export const constantHolidays = [
  {
    id: '31f6a5ec-72c9-47f2-9a66-5e46d253fffd',
    date: new Date('2022-01-01'),
    movable: false,
    comment: "New Year's Day",
  },
];

export const constantHolidaysDb = constantHolidays.map((el) => ({
  ...el,
  toHoliday(): Holiday {
    return {
      id: this.id,
      date: new Date(this.date),
      movable: this.movable,
      comment: this.comment,
    };
  },
}));

export const movableHolidays = [
  {
    id: '31f6a5ec-72c9-47f2-9a66-5e46d253fffd',
    date: new Date('2022-04-22'),
    movable: true,
    comment: 'Ortodox Good Friday',
  },
];

export const movableHolidaysDb = movableHolidays.map((el) => ({
  ...el,
  toHoliday(): Holiday {
    return {
      id: this.id,
      date: new Date(this.date),
      movable: this.movable,
      comment: this.comment,
    };
  },
}));

export const mockEmployeeHolidays = [
  {
    id: '8389e44d-d807-4580-a9bf-ac59c07f1c4f',
    type: AbsenceTypesEnum.paidLeave,
    from_date: '2021-08-04',
    to_date: '2021-08-04',
    comment: 'PTO',
  },
  {
    id: '89b04b55-f047-4ce1-87f2-21f849ccd398',
    type: AbsenceTypesEnum.paidLeave,
    from_date: '2021-08-05',
    to_date: '2021-08-05',
    comment: 'PTO',
  },
];

export const mockEmployeeAbsencesDb = mockEmployeeHolidays.map((el) => ({
  ...el,
  toAbsence(): Absence {
    return {
      id: this.id,
      type: this.type,
      startingDate: new Date(this.from_date),
      endingDate: new Date(this.to_date),
      comment: this.comment,
      employee: this.employee,
    };
  },
}));
export const mockAbsenceDb = {
  id: '0505c3d8-2fb5-4952-a0e7-1b49334f578d',
  type: 'Paid',
  from_date: '2021-07-07',
  to_date: '2021-07-08',
  comment: 'PTO',
  employee: {
    id: 'fc799a20-5885-4390-98ce-7c868c3b3338',
    googleId: '106956791077954804246',
    email: 'kristiyan.peev@atscale.com',
    firstName: 'Kristiyan',
    lastName: 'Peev',
    picture:
      'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
  },
};

export const toAbsence = (absencedb: any): Absence => ({
  id: absencedb.id,
  type: absencedb.type,
  startingDate: new Date(absencedb.from_date),
  endingDate: new Date(absencedb.to_date),
  comment: absencedb.comment,
  employee: absencedb.employee,
});

export const absenceDto = {
  type: AbsenceTypesEnum.paidLeave,
  startingDate: new Date('2021-08-04'),
  endingDate: new Date('2021-08-04'),
  comment: 'Out of office',
};

export const mockedUser = {
  id: '749da264-0641-4d80-b6be-fe1c38ae2f93',
  googleId: '106956791077954804246',
  email: 'kristiyan.peev@atscale.com',
  firstName: 'Kristiyan',
  lastName: 'Peev',
  picture:
    'https://lh3.googleusercontent.com/a-/AOh14Gi-slkOaKm_iev-o1xIbJGHLfsP65VslZm1JyJh=s96-c',
  team: { id: 'id', team: TeamsEnum.noTeam, user: [] },
  position: { id: 'id', position: PositionsEnum.noPosition, user: [] },
};

export const userDb = (user) => ({
  ...user,
  toUser() {
    return {
      id: this.id,
      googleId: this.googleId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      picture: this.picture,
      team: this.team,
      position: this.position,
    };
  },
});

export const mockHolidayPeriodDates = [
  {
    date: new Date('2021-10-05'),
    status: DayStatus.workday,
  },
  {
    date: new Date('2021-10-06'),
    status: DayStatus.workday,
  },
  {
    date: new Date('2021-10-07'),
    status: DayStatus.workday,
  },
];

export const absenceCalculatedWorkingDays = (absence, workingDays, totalDays) => ({
  ...absence,
  workingDays,
  totalDays,
});