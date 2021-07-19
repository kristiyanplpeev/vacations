import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';
import { AuthenticationProvider } from './auth';
import { UserDetails } from '../utils/types';

@Injectable()
export class GoogleService implements AuthenticationProvider {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  // googleLogin(req) {
  //   if (!req.user) {
  //     return 'No user from google';
  //   }
  //   console.log('what is dis2')
  //   return {
  //     message: 'User information from google',
  //     user: req.user,
  //   };

  async validateUser(details: UserDetails) {
    const { email } = details;
    const user = await this.userRepo.findOne({ email });
    if (user) return user;

    return await this.createUser(details);
  }
  async createUser(details: UserDetails) {
    const user = this.userRepo.create(details);
    return this.userRepo.save(user);
  }
  findUser(googleId: string): Promise<User | undefined> {
    return this.userRepo.findOne({ googleId });
  }
}
