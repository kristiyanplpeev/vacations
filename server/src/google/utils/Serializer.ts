import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Userdb } from 'src/model/user.entity';
import { AuthenticationProvider } from '../auth';

type Done = (err: Error, user: Userdb) => void;
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authService: AuthenticationProvider,
  ) {
    super();
  }

  serializeUser(user: Userdb, done: Done) {
    done(null, user);
  }

  async deserializeUser(user: Userdb, done: Done) {
    const userDB = await this.authService.findUser(user.googleId);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
