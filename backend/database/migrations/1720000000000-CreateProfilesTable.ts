import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Supabase Authとの統合のために、既存のusersテーブルを削除し、
 * auth.usersと連携するprofilesテーブルを作成するマイグレーション
 */
export class CreateProfilesTable1720000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // まず、既存のusersテーブルへの外部キー制約を持つテーブルの制約を削除
    await queryRunner.query(`
      ALTER TABLE IF EXISTS meetings
      DROP CONSTRAINT IF EXISTS FK_meetings_organizer_id;
    `);

    await queryRunner.query(`
      ALTER TABLE IF EXISTS meetings
      DROP CONSTRAINT IF EXISTS FK_meetings_client_id;
    `);

    // 新しいprofilesテーブルを作成
    await queryRunner.query(`
      CREATE TYPE user_role AS ENUM ('admin', 'exhibitor', 'client', 'user')
      ON CONFLICT DO NOTHING;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        company_name VARCHAR(100),
        clinic_name VARCHAR(100),
        phone_number VARCHAR(50),
        address TEXT,
        role user_role NOT NULL DEFAULT 'user',
        last_login_at TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // 外部キー制約を再作成（meetingsテーブルからprofilesテーブルへ）
    await queryRunner.query(`
      ALTER TABLE meetings
      ADD CONSTRAINT FK_meetings_organizer_id
      FOREIGN KEY (organizer_id) REFERENCES profiles(id)
      ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE meetings
      ADD CONSTRAINT FK_meetings_client_id
      FOREIGN KEY (client_id) REFERENCES profiles(id)
      ON DELETE CASCADE;
    `);

    // 古いusersテーブルは、データが移行された後に後続のマイグレーションで削除する
    // または手動で削除することも可能
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 外部キー制約を削除
    await queryRunner.query(`
      ALTER TABLE IF EXISTS meetings
      DROP CONSTRAINT IF EXISTS FK_meetings_organizer_id;
    `);

    await queryRunner.query(`
      ALTER TABLE IF EXISTS meetings
      DROP CONSTRAINT IF EXISTS FK_meetings_client_id;
    `);

    // profilesテーブルを削除
    await queryRunner.query(`DROP TABLE IF EXISTS profiles;`);

    // 元の外部キー制約を復元
    await queryRunner.query(`
      ALTER TABLE meetings
      ADD CONSTRAINT FK_meetings_organizer_id
      FOREIGN KEY (organizer_id) REFERENCES users(id)
      ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE meetings
      ADD CONSTRAINT FK_meetings_client_id
      FOREIGN KEY (client_id) REFERENCES users(id)
      ON DELETE CASCADE;
    `);
  }
}