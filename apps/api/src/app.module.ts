import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InitDatabaseModule } from './init-database/init-database.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { TicketModule } from './ticket/ticket.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { ScheduleModule } from '@nestjs/schedule';

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
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [new KeyvRedis('redis://127.0.0.1:6379')],
        };
      },
    }),
    UsersModule,
    AuthModule,
    InitDatabaseModule,
    HealthModule,
    TicketModule,
    ScheduleModule.forRoot(),
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
