import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/model/user.entity';
import { AuthenticationProvider } from '../auth';

type Done = (err: Error, user: User) => void;
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
