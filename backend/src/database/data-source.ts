import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { UnifiedConfigService } from '../config/unified-config.service';
import { User, Exhibition, Meeting, Profile } from '../entities';

// 一時的に設定オブジェクトを作成（後でUnifiedConfigServiceに置き換える）
const tempConfig = new UnifiedConfigService();
const config = tempConfig.getTypeOrmConfig();

// エンティティを明示的に指定
const dataSourceOptions: DataSourceOptions = {
  ...config,
  entities: [User, Exhibition, Meeting, Profile],
  // Supabase接続の場合、SSLは必須
  ssl: config.ssl,
  extra: config.ssl ? {
    ssl: {
      rejectUnauthorized: false,
    },
  } : undefined,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

// 型情報を維持するために残しておく
export { dataSourceOptions };