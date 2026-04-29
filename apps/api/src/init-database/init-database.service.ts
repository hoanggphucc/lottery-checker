import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { RoleEnum } from 'src/core/types';

@Injectable()
export class InitDatabaseService implements OnModuleInit {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    //Init one admin and one user
    const adminList = await this.userService.findByRole(RoleEnum.ADMIN);
    if (adminList.length === 0) {
      console.log(`Init database: creating admin user...`);
      await this.userService.createAdmin({
        name: 'Admin',
        dob: new Date(),
        email: this.configService.get<string>('INIT_ADMIN_EMAIL') || '',
        password: this.configService.get<string>('INIT_ADMIN_PASSWORD') || '',
      });
      console.log(`Init database: created admin user...`);
    }
    const userList = await this.userService.findByRole(RoleEnum.USER);
    if (userList.length === 0) {
      console.log(`Init database: creating user...`);
      await this.userService.create({
        name: 'User 1',
        dob: new Date(),
        email: this.configService.get<string>('INIT_USER_EMAIL') || '',
        password: this.configService.get<string>('INIT_USER_PASSWORD') || '',
      });
      console.log(`Init database: created user...`);
    }

    console.log(`The module has been initialized.`);
  }
}
