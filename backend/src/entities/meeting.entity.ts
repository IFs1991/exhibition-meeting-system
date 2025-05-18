import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Exhibition } from './exhibition.entity';

/**
 * 商談ステータスの定義
 */
export enum MeetingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  DECLINED = 'declined',
}

/**
 * 商談エンティティ
 * 展示会における出展者とクライアント間の商談を表現
 */
@Entity('meetings')
export class Meeting extends BaseEntity {
  @Column({ type: 'uuid' })
  exhibitionId: string;

  @ManyToOne(() => Exhibition, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exhibition_id' })
  exhibition: Exhibition;

  @Column({ type: 'uuid' })
  organizerId: string; // 出展者のユーザーID

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @Column({ type: 'uuid' })
  clientId: string; // クライアントのユーザーID

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp with time zone' })
  endTime: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.PENDING,
  })
  status: MeetingStatus;

  @Column({ name: 'meeting_link', type: 'varchar', length: 2048, nullable: true })
  meetingLink?: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes?: string;
}