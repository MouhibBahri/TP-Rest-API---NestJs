import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';


import { CvModule } from './cv/cv.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { AuthModule } from './auth/auth.module';
import { CvEventsModule } from './cv-events/cv-events.module';
import { SseModule } from './sse/sse.module';
import { MessagingModule } from './messaging/messaging.module';

import { DataSourceOptions } from 'typeorm';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { ChatGateway } from './websocket/chat.gateway';
import { ChatService } from './websocket/chat.service';
import { ChatModule } from './websocket/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'mysql' | 'postgres'>('DB_TYPE') ?? 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true, // Enable logging to see SQL queries
      }),
    }),

    CvModule,
    UserModule,
    SkillModule,
    AuthModule,

    CvEventsModule,
    SseModule,
    MessagingModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
