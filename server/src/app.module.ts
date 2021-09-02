import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config-service';
import { GoogleModule } from './google/google.module';
import { PassportModule } from '@nestjs/passport';
import { HolidaysModule } from './holidays/holidays.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GoogleModule,
    PassportModule.register({ session: true }),
    HolidaysModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
