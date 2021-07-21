import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';
import { AuthenticationProvider } from './auth';
import { UserDetails } from '../utils/types';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'google/utils/types';

@Injectable()
export class GoogleService implements AuthenticationProvider {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  // googleLogin(req) {
  //   if (!req.user) {
  //     return 'No user from google';
  //   }
  //   console.log('what is dis2')
  //   return {
  //     message: 'User information from google',
  //     user: req.user,
  //   };

  async validateUser(details: UserDetails): Promise<UserDetails> {
    const { email } = details;
    const user = await this.userRepo.findOne({ email });
    if (user) return user;

    return await this.createUser(details);
  }
  async createUser(details: UserDetails): Promise<UserDetails> {
    const user = this.userRepo.create(details);
    return this.userRepo.save(user);
  }
  findUser(googleId: string): Promise<User | undefined> {
    return this.userRepo.findOne({ googleId });
  }

  login(details: UserDetails): Token {
    const payload = {
      sub: details.id,
      googleId: details.googleId,
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      picture: details.picture,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
