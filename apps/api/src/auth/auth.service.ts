import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(
        password,
        user.password,
      );
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(user: User, response: Response) {
    const userData = {
      _id: (user as any)?._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      role: user.role,
    };
    const payload = {
      sub: 'token login',
      iss: 'from server',
      ...userData,
    };
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateUserToken((user as any)?._id, refresh_token);
    response.clearCookie('refresh_token');
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: userData,
    };
  }

  createRefreshToken(payload: Partial<User> & { sub: string; iss: string }) {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRE')) / 1000,
    });
    return refresh_token;
  }

  async getAccount(user: User) {
    return await this.usersService.findOne((user as any)._id);
  }

  async updateAccount(user: User, updateUserDto: UpdateUserDto) {
    return await this.usersService.update((user as any)._id, updateUserDto);
  }

  async processNewToken(refresh_token: string, response: Response) {
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.usersService.findOneByToken(refresh_token);
      if (user) {
        return this.login(user, response);
      } else {
        throw new BadRequestException('Refresh token is invalid');
      }
    } catch (err) {
      throw new BadRequestException('Refresh token is invalid');
    }
  }

  async logout(user: User, response: Response) {
    await this.usersService.updateUserToken((user as any)._id, '');
    response.clearCookie('refresh_token');
    return 'ok';
  }
}
