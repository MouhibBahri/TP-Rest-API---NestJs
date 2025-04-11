import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cv])], // Register CvRepository
  controllers: [CvController],
  providers: [CvService],
  exports: [TypeOrmModule], // Export TypeOrmModule to make CvRepository available
})
export class CvModule {}
