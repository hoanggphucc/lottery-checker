import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/customize';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'Hello world!';
  }
}
