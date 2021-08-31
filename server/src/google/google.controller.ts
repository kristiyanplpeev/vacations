import { Controller, Get, Req, UseGuards, Redirect } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthenticatedGuard, GoogleAuthGuard } from './guards';
import { UserDetails } from './utils/interfaces';
import { CLIENT_URL } from '../common/constants';
import { Token } from 'src/google/utils/interfaces';

@Controller('auth')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    return;
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @Redirect(`${CLIENT_URL}redirecting`)
  async googleAuthRedirect(@Req() req): Promise<UserDetails> {
    return await this.googleService.validateUser(req.user);
  }

  @Get('users')
  @UseGuards(AuthenticatedGuard)
  loggedUserInfo(@Req() req): Token {
    return this.googleService.login(req.user);
  }
}
