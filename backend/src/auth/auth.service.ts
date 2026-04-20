import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
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

  async login(user: User) {
    const payload = {
      email: user.email,
      name: user.name,
      dob: user.dob,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
