import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvEvent, CvOperationType } from './entities/cv-event.entity';
import { Cv } from '../cv/entities/cv.entity';
import { User } from '../user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CvEventsService {
  private readonly logger = new Logger(CvEventsService.name);

  constructor(
    @InjectRepository(CvEvent)
    private readonly cvEventRepository: Repository<CvEvent>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createEvent(
    operationType: CvOperationType,
    cv: Cv,
    user: any,
    details?: string,
  ): Promise<CvEvent> {
    this.logger.debug(`Creating CV event: ${operationType} for CV ID: ${cv?.id}`);

    // Handle user from JWT token or User entity
    const userId = user?.userId || user?.id;

    if (!userId) {
      this.logger.warn('No user ID found in the user object', user);
    }

    const event = this.cvEventRepository.create({
      operationType,
      cv,
      cvId: cv?.id,
      userId,
      details,
    });

    const savedEvent = await this.cvEventRepository.save(event);

    // Emit event for SSE
    this.logger.debug(`Emitting cv.operation event for CV ID: ${cv?.id}`);
    this.eventEmitter.emit('cv.operation', savedEvent);

    return savedEvent;
  }

  async findAll(): Promise<CvEvent[]> {
    return this.cvEventRepository.find({
      relations: ['cv', 'user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<CvEvent[]> {
    return this.cvEventRepository.find({
      where: { userId },
      relations: ['cv', 'user'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByCv(cvId: number): Promise<CvEvent[]> {
    return this.cvEventRepository.find({
      where: { cvId },
      relations: ['cv', 'user'],
      order: { timestamp: 'DESC' },
    });
  }
}
