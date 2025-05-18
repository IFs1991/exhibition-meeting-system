import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Meeting } from './meeting.entity';

/**
 * システムで使用される全ユーザーの種別
 */
export enum UserRole {
  ADMIN = 'admin',
  EXHIBITOR = 'exhibitor',
  CLIENT = 'client',
  USER = 'user',
}

/**
 * ユーザーエンティティ
 * 管理者、出展者、クライアントなど全てのシステムユーザーを表現
 */
@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255, nullable: true })
  passwordHash?: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ name: 'company_name', type: 'varchar', length: 100, nullable: true })
  companyName?: string;

  @Column({ name: 'clinic_name', type: 'varchar', length: 100, nullable: true })
  clinicName?: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 50, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'last_login_at', type: 'timestamp with time zone', nullable: true })
  lastLoginAt?: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // リレーションシップ
  @OneToMany(() => Meeting, meeting => meeting.organizer)
  organizedMeetings: Meeting[];

  @OneToMany(() => Meeting, meeting => meeting.client)
  participatedMeetings: Meeting[];
}