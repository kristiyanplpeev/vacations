export const CLIENT_URL = 'http://localhost:3000/';

export const postgresHost = 'POSTGRES_HOST';
export const postgresPort = 'POSTGRES_PORT';
export const postgresUser = 'POSTGRES_USER';
export const postgresPass = 'POSTGRES_PASSWORD';
export const postgresDB = 'POSTGRES_DATABASE';

export const nonWorkingDaysCount = 2;

export const maxYearDifference = 1;

export const invalidDateFormatMessage = "Date must be yyyy-mm-dd formatted string.";

export enum DayStatus {
  weekend = 'weekend',
  workday = 'workday',
}

export enum UserRelations {
  employee = 'employee',
  teams = 'team',
  positions = 'position',
}

export enum TeamsEnum {
  orchestrator = 'Orchestrator',
  datadash = 'Datadash',
  test = 'Test team',
  noTeam = 'no team',
}

export enum PositionsEnum {
  junior = 'Junior',
  regular = 'Regular',
  senior = 'Senior',
  lead = 'Team lead',
  noPosition = 'no position',
}

export enum AbsenceTypesEnum {
  paidLeave = 'Paid',
  unpaidLeave = 'Unpaid',
  weddingLeave = 'Wedding',
  bereavementLeave = 'Bereavement',
  bloodDonationLeave = 'Blood donation',
  courtLeave = 'Court',
}
