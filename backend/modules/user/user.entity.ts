import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Meeting } from '../meeting/meeting.entity';

export enum UserRole {
  ADMIN = 'admin',
  EXHIBITOR = 'exhibitor',
  CLIENT = 'client',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 }) // Explicitly map to DB column
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100 }) // Explicitly map to DB column
  fullName: string;

  @Column({ name: 'clinic_name', type: 'varchar', length: 100 }) // Map to clinic_name, NOT NULL as per schema
  clinicName: string; // Changed from companyName, made non-nullable

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole; // 'role' column name matches schema

  @CreateDateColumn({ name: 'created_at' }) // Explicitly map to DB column
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) // Explicitly map to DB column
  updatedAt: Date;

  @OneToMany(() => Meeting, meeting => meeting.organizer)
  organizedMeetings: Meeting[];

  @OneToMany(() => Meeting, meeting => meeting.client)
  invitedMeetings: Meeting[];
}