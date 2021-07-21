import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'dotenv';

config();

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      googleId: payload.googleId,
      name: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      picture: payload.picture,
    };
  }
}
