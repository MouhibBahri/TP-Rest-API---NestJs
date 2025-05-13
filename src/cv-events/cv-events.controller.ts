import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CvEventsService } from './cv-events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { User } from '../auth/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('cv-events')
@Controller('cv-events')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CvEventsController {
  constructor(private readonly cvEventsService: CvEventsService) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all CV events (Admin only)' })
  findAll() {
    return this.cvEventsService.findAll();
  }

  @Get('my-events')
  @ApiOperation({ summary: 'Get CV events for the current user' })
  findMyEvents(@User() user) {
    return this.cvEventsService.findByUser(user.userId);
  }

  @Get('cv/:id')
  @ApiOperation({ summary: 'Get events for a specific CV' })
  findByCv(@Param('id') id: string, @User() user) {
    return this.cvEventsService.findByCv(+id);
  }
}
