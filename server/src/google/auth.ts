import { Token } from 'src/google/utils/interfaces';
import { Userdb } from '../model/user.entity';
import { User } from './utils/interfaces';

export interface AuthenticationProvider {
  validateUser(details: User): Promise<User>;
  createUser(details: User): Promise<User>;
  findUser(googleId: string): Promise<Userdb | undefined>;
  login(details: User): Token;
}
