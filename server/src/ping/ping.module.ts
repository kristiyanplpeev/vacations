import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { PingController } from './ping.controller';
import { Message } from '../model/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/config-service';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [PingService],
  controllers: [PingController],
})
export class PingModule {}
