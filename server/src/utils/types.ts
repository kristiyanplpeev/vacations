import { User } from '../model/user.entity';

export type UserDetails = {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
};

export type Done = (err: Error, user: User) => void;

export type QueryFail = {
  statusCode: number;
  message: string;
  error: string;
};

export type ErrorMessage = {
  message: string;
};

export type PTOInfo = {
  totalDays: number;
  PTODays: number;
  from_date: string;
  to_date: string;
  comment: string;
  status: string;
  id: string;
};
