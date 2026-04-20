import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RolesService } from 'src/roles/roles.service';
import { RoleNameEnum } from 'src/roles/types.role';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class InitDatabaseService implements OnModuleInit {
  constructor(
    private userService: UsersService,
    private roleService: RolesService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    //Init role data
    const roleAdmin = await this.roleService.findOneByName(RoleNameEnum.ADMIN);
    if (!roleAdmin) {
      console.log(`Init database: creating admin role...`);
      await this.roleService.create({
        name: RoleNameEnum.ADMIN,
      });
      console.log(`Init database: created admin role...`);
    }

    const roleUser = await this.roleService.findOneByName(RoleNameEnum.USER);
    if (!roleUser) {
      console.log(`Init database: creating user role...`);
      await this.roleService.create({
        name: RoleNameEnum.USER,
      });
      console.log(`Init database: created user role...`);
    }

    //Init one admin and one user
    const adminList = await this.userService.findByRole(RoleNameEnum.ADMIN);
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
    const userList = await this.userService.findByRole(RoleNameEnum.USER);
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
