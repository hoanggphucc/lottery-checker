import KeyvRedis from '@keyv/redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { InitDatabaseModule } from './init-database/init-database.module';
import { MailModule } from './mail/mail.module';
import { TicketModule } from './ticket/ticket.module';
import { UsersModule } from './users/users.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import ms from 'ms';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: Number(config.get<string>('THROTTLE_TTL')),
          limit: Number(config.get<string>('THROTTLE_LIMIT')),
        },
      ],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (config: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(
              `redis://127.0.0.1:${config.get<number>('REDIS_PORT')}`,
            ),
          ],
          ttl: ms(config.get<string>('REDIS_TTL')),
        };
      },
    }),
    UsersModule,
    AuthModule,
    InitDatabaseModule,
    HealthModule,
    TicketModule,
    ScheduleModule.forRoot(),
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
