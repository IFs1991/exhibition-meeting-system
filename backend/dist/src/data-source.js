"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const path = require("path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.dataSourceOptions = {
    type: 'postgres',
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
    ],
    migrations: [path.join(__dirname, '..', 'database', 'migrations', '*.ts')],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map