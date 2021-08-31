import { Token } from 'src/google/utils/interfaces';
import { User } from '../model/user.entity';
import { UserDetails } from './utils/interfaces';

export interface AuthenticationProvider {
  validateUser(details: UserDetails): Promise<UserDetails>;
  createUser(details: UserDetails): Promise<UserDetails>;
  findUser(googleId: string): Promise<User | undefined>;
  login(details: UserDetails): Token;
}
