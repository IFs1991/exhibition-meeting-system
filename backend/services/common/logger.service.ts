import { Logger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logging } from '@google-cloud/logging';

export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);
  private readonly cloudLogging: Logging;
  private readonly logLevel: LogLevel;

  constructor(private readonly configService: ConfigService) {
    this.cloudLogging = new Logging({
      projectId: this.configService.get('GCP_PROJECT_ID'),
      keyFilename: this.configService.get('GCP_KEY_FILE'),
    });

    this.logLevel = this.configService.get('LOG_LEVEL', 'info');
  }

  private formatMessage(message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? JSON.stringify(context) : '';
    return `[${timestamp}] ${message} ${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['error', 'warn', 'info', 'debug', 'verbose'];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  async log(message: string, context?: Record<string, any>): Promise<void> {
    if (!this.shouldLog('info')) return;

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

  async error(message: string, error?: Error, context?: Record<string, any>): Promise<void> {
    if (!this.shouldLog('error')) return;

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

  async warn(message: string, context?: Record<string, any>): Promise<void> {
    if (!this.shouldLog('warn')) return;

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

  async debug(message: string, context?: Record<string, any>): Promise<void> {
    if (!this.shouldLog('debug')) return;

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