import { Controller, Get, Req, UseGuards, Redirect } from '@nestjs/common';
import { GoogleService } from './google.service';
import { AuthenticatedGuard, GoogleAuthGuard } from './guards';
import { CLIENT_URL } from '../common/constants';
import { Token } from 'src/google/utils/interfaces';
import { UserResponseDto } from './dto/google.dto';
import { plainToClass } from 'class-transformer';

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
  async googleAuthRedirect(@Req() req): Promise<UserResponseDto> {
    const user = await this.googleService.validateUser(req.user);
    return plainToClass(UserResponseDto, user)
  }

  @Get('users')
  @UseGuards(AuthenticatedGuard)
  loggedUserInfo(@Req() req): Token {
    return this.googleService.login(req.user);
  }
}
