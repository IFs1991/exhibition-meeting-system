import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRole } from './user.entity';

/**
 * プロファイルエンティティ
 * Supabase Authの auth.users テーブルと連携し、アプリケーション固有のユーザー情報を保持する
 */
@Entity('profiles')
export class Profile {
  /**
   * ユーザーID - auth.users.idに対応するUUID
   */
  @PrimaryColumn({ type: 'uuid' })
  id: string; // auth.users.id への外部キーとなる値

  @Column({ type: 'varchar', length: 255 })
  email: string;

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

  @Column({ name: 'created_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;
}