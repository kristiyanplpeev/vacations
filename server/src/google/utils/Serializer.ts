import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '/home/kristiyan/Repos/vacations/server/src//model/user.entity';
import { AuthenticationProvider } from '../auth';
import { Done } from '../../utils/types';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super();
  }

  serializeUser(user: User, done: Done) {
    done(null, user);
  }

  async deserializeUser(user: User, done: Done) {
    const userDB = await this.authService.findUser(user.googleId);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
