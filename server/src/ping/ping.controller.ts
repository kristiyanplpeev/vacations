import { Controller, Get } from '@nestjs/common';
import { Message } from '../model/message.entity';
import { PingService } from './ping.service';

@Controller('ping')
export class PingController {
  constructor(private serv: PingService) {}

  @Get()
  public async getMessages(): Promise<Message[]> {
    return await this.serv.getAllMessages();
  }
}
