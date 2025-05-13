import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvEvent } from './entities/cv-event.entity';
import { CvEventsService } from './cv-events.service';
import { CvEventsController } from './cv-events.controller';
import { CvModule } from '../cv/cv.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CvEvent]),
    forwardRef(() => CvModule),
  ],
  controllers: [CvEventsController],
  providers: [CvEventsService],
  exports: [CvEventsService],
})
export class CvEventsModule {}
