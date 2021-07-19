import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthenticatedGuard, GoogleAuthGuard } from './guards';
import { Request } from 'express';

@Controller('auth')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req: Request) {
    return;
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @Redirect(`http://localhost:3000/home`)
  googleAuthRedirect(@Req() req) {
    return this.googleService.validateUser(req.user);
  }

  @Get('user')
  @UseGuards(AuthenticatedGuard)
  loggedUserInfo(@Req() req: Request) {
    return req.user;
  }
}
