import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

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

  @Patch('/account')
  @ResponseMessage('Update user information')
  updateAccount(@User() user, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateAccount(user, updateUserDto);
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage('Get user by refresh token in cookie')
  handleRefreshTokenInCookie(
    @Cookies('refresh_token') refresh_token,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.processNewToken(refresh_token, response);
  }

  @Public()
  @Post('/refresh')
  @ResponseMessage('Get user by refresh token in body')
  handleRefreshToken(
    @Body('refresh_token') refresh_token,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.processNewToken(refresh_token, response);
  }

  @Post('/logout')
  @ResponseMessage('Logout user')
  logout(@User() user, @Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user, response);
  }
}
