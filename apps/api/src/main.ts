import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { PoliciesGuard } from './auth/casl/policies.guard';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { TicketService } from './ticket/ticket.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const ticketService = app.get(TicketService);
  const port = configService.get('PORT');
  const reflector = app.get(Reflector);

  //config jwt guard
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  //config policies guard
  app.useGlobalGuards(new PoliciesGuard(reflector, ticketService));

  app.useGlobalPipes(new ValidationPipe());

  //config interceptor for response
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //config api version
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  //config cookies
  app.use(cookieParser());

  //config helmet
  app.use(helmet());

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('APIs Document')
    .setDescription('Description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}
bootstrap();
