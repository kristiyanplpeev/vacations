import { GoogleService } from './google.service';
import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { GoogleController } from './google.controller';
import { Userdb } from '../model/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionSerializer } from './utils/Serializer';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Userdb]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
  ],
  controllers: [GoogleController],
  providers: [
    GoogleStrategy,
    JwtStrategy,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: GoogleService,
    },
    GoogleService,
  ],
  exports: [GoogleService],
})
export class GoogleModule {}
