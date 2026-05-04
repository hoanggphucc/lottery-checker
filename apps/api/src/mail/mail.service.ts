import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { RoleEnum } from 'src/core/types';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async send(args: ISendMailOptions) {
    await this.mailerService.sendMail({
      to: 'hoangvanphuc16@gmail.com',
      from: 'Support Team',
      ...args,
    });
  }

  async test(user: User) {
    if (user.role !== RoleEnum.ADMIN) throw new ForbiddenException();

    await this.send({
      subject: 'Welcome to App',
      template: 'test',
    });
  }
}
