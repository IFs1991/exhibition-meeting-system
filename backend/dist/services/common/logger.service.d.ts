import { ConfigService } from '@nestjs/config';
export declare class LoggerService {
    private readonly configService;
    private readonly logger;
    private readonly cloudLogging;
    private readonly logLevel;
    constructor(configService: ConfigService);
    private formatMessage;
    private shouldLog;
    log(message: string, context?: Record<string, any>): Promise<void>;
    error(message: string, error?: Error, context?: Record<string, any>): Promise<void>;
    warn(message: string, context?: Record<string, any>): Promise<void>;
    debug(message: string, context?: Record<string, any>): Promise<void>;
}
