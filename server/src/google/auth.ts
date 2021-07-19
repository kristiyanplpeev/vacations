import { User } from '../model/user.entity';
import { UserDetails } from '../utils/types';

export interface AuthenticationProvider {
  validateUser(details: UserDetails);
  createUser(details: UserDetails);
  findUser(googleId: string): Promise<User | undefined>;
}
