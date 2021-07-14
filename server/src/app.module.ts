import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config-service';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    PingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

