import { Controller, Get } from '@nestjs/common';
import { ResponseMessage, User } from 'src/decorators/customize';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('/test')
  @ResponseMessage('Test Send email')
  test(@User() user) {
    return this.mailService.test(user);
  }
}
