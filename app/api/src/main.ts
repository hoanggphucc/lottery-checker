import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { PoliciesGuard } from './auth/casl/policies.guard';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalGuards(new PoliciesGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  await app.listen(port);
}
bootstrap();
