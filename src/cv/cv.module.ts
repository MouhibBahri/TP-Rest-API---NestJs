import { Module, forwardRef, MiddlewareConsumer, NestModule } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { CvV2Controller } from './cv-v2/cv-v2.controller';
import { Cv } from './entities/cv.entity';
import { CvEventsModule } from '../cv-events/cv-events.module';
import { CvEventsService } from '../cv-events/cv-events.service';
import { AuthMiddleware } from '../middleware/cv-auth/cv-auth.middleware';
import { FileUploadService } from 'src/common/fileUpload.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Cv]),
    forwardRef(() => CvEventsModule),
  ],

  controllers: [CvController, CvV2Controller],
  providers: [CvService, FileUploadService],
  exports: [TypeOrmModule],
})
export class CvModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CvV2Controller);
  }
}
