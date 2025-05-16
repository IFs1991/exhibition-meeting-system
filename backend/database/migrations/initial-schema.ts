import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1709123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pg_vector extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector;`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        clinic_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create receipt_cases table
    await queryRunner.query(`
      CREATE TABLE receipt_cases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id VARCHAR(50) NOT NULL,
        injury_site VARCHAR(100) NOT NULL,
        symptoms TEXT NOT NULL,
        treatment_details TEXT NOT NULL,
        reason_content TEXT NOT NULL,
        content_vector vector(1536),
        approval_status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create tags table
    await queryRunner.query(`
      CREATE TABLE tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create receipt_case_tags table (junction table)
    await queryRunner.query(`
      CREATE TABLE receipt_case_tags (
        receipt_case_id UUID REFERENCES receipt_cases(id) ON DELETE CASCADE,
        tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (receipt_case_id, tag_id)
      );
    `);

    // Create ai_interactions table
    await queryRunner.query(`
      CREATE TABLE ai_interactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        receipt_case_id UUID REFERENCES receipt_cases(id),
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        feedback_score INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX idx_receipt_cases_content_vector ON receipt_cases USING ivfflat (content_vector vector_cosine_ops);
      CREATE INDEX idx_receipt_cases_injury_site ON receipt_cases(injury_site);
      CREATE INDEX idx_receipt_cases_approval_status ON receipt_cases(approval_status);
      CREATE INDEX idx_tags_category ON tags(category);
      CREATE INDEX idx_ai_interactions_user_id ON ai_interactions(user_id);
      CREATE INDEX idx_ai_interactions_receipt_case_id ON ai_interactions(receipt_case_id);
    `);

    // Create updated_at triggers
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    `);

    await queryRunner.query(`
      CREATE TRIGGER update_receipt_cases_updated_at
        BEFORE UPDATE ON receipt_cases
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_receipt_cases_updated_at ON receipt_cases;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS update_users_updated_at ON users;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_ai_interactions_receipt_case_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_ai_interactions_user_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tags_category;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_receipt_cases_approval_status;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_receipt_cases_injury_site;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_receipt_cases_content_vector;`);
    await queryRunner.query(`DROP TABLE IF EXISTS ai_interactions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS receipt_case_tags;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tags;`);
    await queryRunner.query(`DROP TABLE IF EXISTS receipt_cases;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS vector;`);
  }
}