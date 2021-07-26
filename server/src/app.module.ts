import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config-service';
import { PingModule } from './ping/ping.module';
import { GoogleModule } from './google/google.module';
import { PassportModule } from '@nestjs/passport';
import { HolidaysService } from './holidays/holidays.service';
import { HolidaysController } from './holidays/holidays.controller';
import { HolidaysModule } from './holidays/holidays.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    PingModule,
    GoogleModule,
    PassportModule.register({ session: true }),
    HolidaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
