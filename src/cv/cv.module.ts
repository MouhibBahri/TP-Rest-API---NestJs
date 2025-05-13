import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { CvEventsModule } from '../cv-events/cv-events.module';
import { CvEventsService } from '../cv-events/cv-events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv]),
    forwardRef(() => CvEventsModule),
  ],
  controllers: [CvController],
  providers: [CvService],
  exports: [TypeOrmModule], 
})
export class CvModule {}
