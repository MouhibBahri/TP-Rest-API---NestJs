import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { OnEvent } from '@nestjs/event-emitter';
import { CvEvent } from '../cv-events/entities/cv-event.entity';

@Injectable()
export class SseService {
  private readonly logger = new Logger(SseService.name);
  private readonly adminEvents = new Subject<CvEvent>();
  private readonly userEvents = new Map<string, Subject<CvEvent>>();

  @OnEvent('cv.operation')
  handleCvOperation(event: CvEvent) {
    this.logger.debug(`Handling CV operation event: ${event.operationType} for CV ID: ${event.cvId}`);

    // Send to admin channel
    this.adminEvents.next(event);

    // Send to user channel if it exists and the CV belongs to the user
    if (event.userId && this.userEvents.has(event.userId)) {
      this.logger.debug(`Sending event to user channel: ${event.userId}`);
      this.userEvents.get(event.userId).next(event);
    }
  }

  getAdminEventStream() {
    this.logger.debug('Admin requested event stream');
    return this.adminEvents.asObservable();
  }

  getUserEventStream(userId: string) {
    this.logger.debug(`User ${userId} requested event stream`);
    if (!this.userEvents.has(userId)) {
      this.logger.debug(`Creating new event stream for user ${userId}`);
      this.userEvents.set(userId, new Subject<CvEvent>());
    }
    return this.userEvents.get(userId).asObservable();
  }

  removeUserEventStream(userId: string) {
    this.logger.debug(`Removing event stream for user ${userId}`);
    if (this.userEvents.has(userId)) {
      this.userEvents.delete(userId);
    }
  }
}
