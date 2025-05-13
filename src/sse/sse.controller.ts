import { Controller, Sse, UseGuards } from '@nestjs/common';
import { SseService } from './sse.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { User } from '../auth/decorators/user.decorator';
import { Observable, map } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('sse')
@Controller('sse')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('admin-events')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'SSE stream for admin (all CV operations)' })
  adminEvents(): Observable<MessageEvent> {
    return this.sseService.getAdminEventStream().pipe(
      map((event) => ({
        data: {
          ...event,
          message: `CV ${event.operationType} operation performed`,
        },
      })),
    );
  }

  @Sse('user-events')
  @ApiOperation({ summary: 'SSE stream for user (only their CV operations)' })
  userEvents(@User() user): Observable<MessageEvent> {
    return this.sseService.getUserEventStream(user.userId).pipe(
      map((event) => ({
        data: {
          ...event,
          message: `CV ${event.operationType} operation performed`,
        },
      })),
    );
  }
}
