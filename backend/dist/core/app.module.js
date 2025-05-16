"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./modules/user/user.module");
const receipt_module_1 = require("./modules/receipt/receipt.module");
const ai_module_1 = require("./modules/ai/ai.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const stats_module_1 = require("./modules/stats/stats.module");
const client_module_1 = require("./modules/client/client.module");
const meeting_module_1 = require("../modules/meeting/meeting.module");
const logger_service_1 = require("./services/common/logger.service");
const error_handler_service_1 = require("./services/common/error-handler.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT, 10),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE,
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: process.env.NODE_ENV !== 'production',
                    logging: process.env.NODE_ENV === 'development',
                    ssl: process.env.NODE_ENV === 'production'
                })
            }),
            user_module_1.UserModule,
            receipt_module_1.ReceiptModule,
            ai_module_1.AiModule,
            feedback_module_1.FeedbackModule,
            stats_module_1.StatsModule,
            client_module_1.ClientModule,
            meeting_module_1.MeetingModule
        ],
        providers: [
            logger_service_1.LoggerService,
            error_handler_service_1.ErrorHandlerService,
            {
                provide: 'APP_INTERCEPTOR',
                useClass: logger_service_1.LoggerService
            },
            {
                provide: 'APP_FILTER',
                useClass: error_handler_service_1.ErrorHandlerService
            }
        ],
        exports: [logger_service_1.LoggerService, error_handler_service_1.ErrorHandlerService]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map