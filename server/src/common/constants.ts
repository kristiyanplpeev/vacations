export const CLIENT_URL = 'http://localhost:3000/';

export const postgresHost = 'POSTGRES_HOST';
export const postgresPort = 'POSTGRES_PORT';
export const postgresUser = 'POSTGRES_USER';
export const postgresPass = 'POSTGRES_PASSWORD';
export const postgresDB = 'POSTGRES_DATABASE';

export enum DayStatus {
  weekend = 'weekend',
  workday = 'workday',
}

export enum PTOStatus {
  requested = 'requested',
  approved = 'approved',
  rejected = 'rejected',
}

export enum UserRelations {
  employee = 'employee',
  approvers = 'approvers',
}
