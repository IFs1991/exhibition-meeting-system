import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { UnifiedConfigService } from '../config/unified-config.service';
import { User, Exhibition, Meeting } from '../entities';

// 一時的に設定オブジェクトを作成（後でUnifiedConfigServiceに置き換える）
const tempConfig = new UnifiedConfigService();
const config = tempConfig.getTypeOrmConfig();

// エンティティを明示的に指定
const dataSourceOptions: DataSourceOptions = {
  ...config,
  entities: [User, Exhibition, Meeting],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

// 型情報を維持するために残しておく
export { dataSourceOptions };