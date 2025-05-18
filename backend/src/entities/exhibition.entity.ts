import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Client } from './client.entity';
import { Meeting } from './meeting.entity';

@Entity('exhibitions')
export class Exhibition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp with time zone' })
  startDate: Date;

  @Column({ type: 'timestamp with time zone' })
  endDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'text', nullable: true })
  additionalInfo?: string;

  @ManyToMany(() => Client)
  @JoinTable({
    name: 'exhibition_clients',
    joinColumn: { name: 'exhibition_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'client_id', referencedColumnName: 'id' }
  })
  clients: Client[];

  @OneToMany(() => Meeting, meeting => meeting.exhibition)
  meetings: Meeting[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}