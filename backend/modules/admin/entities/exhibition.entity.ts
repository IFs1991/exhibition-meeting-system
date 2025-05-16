import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity'; // Assuming Client entity is in the same directory

@Entity('exhibitions')
export class Exhibition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ length: 255, nullable: true })
  location?: string;

  // Example of a relationship if an exhibition is linked to a client (organizer)
  // @ManyToOne(() => Client, client => client.exhibitions, { nullable: true })
  // @JoinColumn({ name: 'clientId' })
  // client?: Client;
  //
  // @Column({ type: 'uuid', nullable: true })
  // clientId?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date; // For soft delete
}