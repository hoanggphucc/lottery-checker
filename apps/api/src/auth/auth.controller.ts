import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import {
  Cookies,
  Public,
  ResponseMessage,
  User,
} from '../decorators/customize';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage('User Login')
  async login(
    @User() user,
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Get('/account')
  @ResponseMessage('Get user information')
  getAccount(@User() user) {
    return this.authService.getAccount(user);
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage('Get user by refresh token')
  handleRefreshToken(
    @Cookies('refresh_token') refreshToken,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('/logout')
  @ResponseMessage('Logout user')
  logout(@User() user, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user, response);
  }
}
