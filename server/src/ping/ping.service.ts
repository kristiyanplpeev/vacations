import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../model/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PingService {
  constructor(
    @InjectRepository(Message) private readonly repo: Repository<Message>,
  ) {}

  public async getAllMessages() {
    return await this.repo.find();
  }
}
