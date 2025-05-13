import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';
import { UserEntity } from '../../auth/entities/user.entity';

export enum CvOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
}

@Entity()
export class CvEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CvOperationType,
  })
  operationType: CvOperationType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ nullable: true })
  details: string;

  @ManyToOne(() => Cv, { nullable: true, onDelete: 'SET NULL' })
  cv: Cv;

  @Column({ nullable: true })
  cvId: number;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  user: UserEntity;

  @Column({ nullable: true, type: 'varchar' })
  userId: string;
}
