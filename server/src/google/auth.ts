import { Token } from 'google/utils/types';
import { User } from '../model/user.entity';
import { UserDetails } from '../utils/types';

export interface AuthenticationProvider {
  validateUser(details: UserDetails): Promise<UserDetails>;
  createUser(details: UserDetails): Promise<UserDetails>;
  findUser(googleId: string): Promise<User | undefined>;
  login(details: UserDetails): Token;
}
