import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Client } from '../../client/entities/client.entity';

@Entity('exhibitions')
export class Exhibition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  location: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'text', nullable: true })
  additionalInfo?: string;

  @ManyToMany(() => Client, client => client.exhibitions)
  @JoinTable({
    name: 'exhibition_clients',
    joinColumn: { name: 'exhibition_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'client_id', referencedColumnName: 'id' }
  })
  clients: Client[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}