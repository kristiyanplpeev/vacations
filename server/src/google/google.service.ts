import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Userdb } from '../model/user.entity';
import { Repository } from 'typeorm';
import { AuthenticationProvider } from './auth';
import { User } from './utils/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/google/utils/interfaces';

@Injectable()
export class GoogleService implements AuthenticationProvider {
  constructor(
    @InjectRepository(Userdb) private userRepo: Repository<Userdb>,
    private jwtService: JwtService,
  ) {}

  public async validateUser(details: User): Promise<User> {
    const { email } = details;
    const user = await this.userRepo.findOne({ email });
    if (user) return user.toUser();

    return await this.createUser(details);
  }
  async createUser(details: User): Promise<User> {
    const user = this.userRepo.create(details);
    return (await this.userRepo.save(user)).toUser();
  }
  async findUser(googleId: string): Promise<Userdb | undefined> {
    return await this.userRepo.findOne({ googleId });
  }

  login(details: User): Token {
    const payload = {
      sub: details.id,
      googleId: details.googleId,
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      picture: details.picture,
      role: details.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
