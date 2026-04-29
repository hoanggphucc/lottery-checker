import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Public, ResponseMessage } from 'src/decorators/customize';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  @ResponseMessage('Get health status')
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
