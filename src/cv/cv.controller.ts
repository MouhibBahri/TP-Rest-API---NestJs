import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FilterCvDto } from './dto/filter-cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { CvEventsService } from '../cv-events/cv-events.service';
import { CvOperationType } from '../cv-events/entities/cv-event.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('cv')
@Controller('cv')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly cvEventsService: CvEventsService,
  ) {}

  @Post()
  async create(@Body() createCvDto: CreateCvDto, @User() user) {
    const cv = await this.cvService.create(createCvDto);
    await this.cvEventsService.createEvent(
      CvOperationType.CREATE,
      cv,
      user,
      'CV created',
    );
    return cv;
  }

  @Get()
  async findAll(@Query() filterCvDto: FilterCvDto) {
    return this.cvService.findAll(filterCvDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user) {
    const cv = await this.cvService.findOne(+id);
    if (cv) {
      await this.cvEventsService.createEvent(
        CvOperationType.VIEW,
        cv,
        user,
        'CV viewed',
      );
    }
    return cv;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @User() user) {
    const cv = await this.cvService.update(+id, updateCvDto);
    if (cv) {
      await this.cvEventsService.createEvent(
        CvOperationType.UPDATE,
        cv,
        user,
        'CV updated',
      );
    }
    return cv;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @User() user) {
    const cv = await this.cvService.findOne(+id);
    if (cv) {
      await this.cvEventsService.createEvent(
        CvOperationType.DELETE,
        cv,
        user,
        'CV deleted',
      );
      return this.cvService.remove(+id);
    }
    return null;
  }
}
