import { User } from '../model/user.entity';

export type UserDetails = {
  id: string;
  googleId: string;
  email: string;
  firsName: string;
  lastName: string;
  picture: string;
};

export type Done = (err: Error, user: User) => void;
