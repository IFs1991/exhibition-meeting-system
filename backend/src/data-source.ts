import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { config } from 'dotenv';

config(); // .envファイルから環境変数を読み込む

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres', // 例: postgres, mysql, sqliteなど、使用するデータベースのタイプ
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'your_db_user',
  password: process.env.DB_PASSWORD || 'your_db_password',
  database: process.env.DB_NAME || 'your_db_name',
  entities: [
    path.join(__dirname, '..', 'modules', 'user', 'user.entity.ts'),
    path.join(__dirname, '..', 'modules', 'meeting', 'meeting.entity.ts'),
    path.join(__dirname, '..', 'modules', 'admin', 'exhibition', 'entities', 'exhibition.entity.ts'),
    path.join(__dirname, '..', 'modules', 'client', 'entities', 'client.entity.ts'),
  ], // エンティティファイルへのパス
  migrations: [path.join(__dirname, '..', 'database', 'migrations', '*.ts')], // マイグレーションファイルへのパス
  synchronize: false, // 本番環境ではfalseに設定
  logging: process.env.NODE_ENV === 'development', // 開発環境ではログを有効化
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;