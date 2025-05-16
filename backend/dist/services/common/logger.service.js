"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const logging_1 = require("@google-cloud/logging");
class LoggerService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(LoggerService.name);
        this.cloudLogging = new logging_1.Logging({
            projectId: this.configService.get('GCP_PROJECT_ID'),
            keyFilename: this.configService.get('GCP_KEY_FILE'),
        });
        this.logLevel = this.configService.get('LOG_LEVEL', 'info');
    }
    formatMessage(message, context) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? JSON.stringify(context) : '';
        return `[${timestamp}] ${message} ${contextStr}`;
    }
    shouldLog(level) {
        const levels = ['error', 'warn', 'info', 'debug', 'verbose'];
        return levels.indexOf(level) <= levels.indexOf(this.logLevel);
    }
    async log(message, context) {
        if (!this.shouldLog('info'))
            return;
        const formattedMessage = this.formatMessage(message, context);
        this.logger.log(formattedMessage);
        const log = this.cloudLogging.log('app-logs');
        const metadata = {
            severity: 'INFO',
            resource: {
                type: 'cloud_run_revision',
                labels: {
                    service_name: this.configService.get('SERVICE_NAME'),
                    revision_name: this.configService.get('REVISION_NAME'),
                },
            },
        };
        await log.write(log.entry(metadata, { message: formattedMessage, ...context }));
    }
    async error(message, error, context) {
        if (!this.shouldLog('error'))
            return;
        const errorContext = {
            ...context,
            error: error ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
            } : undefined,
        };
        const formattedMessage = this.formatMessage(message, errorContext);
        this.logger.error(formattedMessage);
        const log = this.cloudLogging.log('app-errors');
        const metadata = {
            severity: 'ERROR',
            resource: {
                type: 'cloud_run_revision',
                labels: {
                    service_name: this.configService.get('SERVICE_NAME'),
                    revision_name: this.configService.get('REVISION_NAME'),
                },
            },
        };
        await log.write(log.entry(metadata, { message: formattedMessage, ...errorContext }));
    }
    async warn(message, context) {
        if (!this.shouldLog('warn'))
            return;
        const formattedMessage = this.formatMessage(message, context);
        this.logger.warn(formattedMessage);
        const log = this.cloudLogging.log('app-warnings');
        const metadata = {
            severity: 'WARNING',
            resource: {
                type: 'cloud_run_revision',
                labels: {
                    service_name: this.configService.get('SERVICE_NAME'),
                    revision_name: this.configService.get('REVISION_NAME'),
                },
            },
        };
        await log.write(log.entry(metadata, { message: formattedMessage, ...context }));
    }
    async debug(message, context) {
        if (!this.shouldLog('debug'))
            return;
        const formattedMessage = this.formatMessage(message, context);
        this.logger.debug(formattedMessage);
        const log = this.cloudLogging.log('app-debug');
        const metadata = {
            severity: 'DEBUG',
            resource: {
                type: 'cloud_run_revision',
                labels: {
                    service_name: this.configService.get('SERVICE_NAME'),
                    revision_name: this.configService.get('REVISION_NAME'),
                },
            },
        };
        await log.write(log.entry(metadata, { message: formattedMessage, ...context }));
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map