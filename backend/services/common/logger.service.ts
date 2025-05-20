import { ConsoleLogger, Injectable, LogLevel as NestLogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Logging } from '@google-cloud/logging'; // GCP Logging not used

@Injectable()
export class LoggerService extends ConsoleLogger {
  // private readonly cloudLogging: Logging; // GCP Logging not used

  constructor(private readonly configService: ConfigService) {
    super(LoggerService.name); // Set context for ConsoleLogger

    // Determine log levels based on config
    const configuredLogLevel = this.configService.get<string>('LOG_LEVEL', 'info').toLowerCase();
    const availableLogLevels: NestLogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
    let activeLogLevels: NestLogLevel[] = availableLogLevels;

    switch (configuredLogLevel) {
      case 'error':
        activeLogLevels = ['error'];
        break;
      case 'warn':
        activeLogLevels = ['error', 'warn'];
        break;
      case 'log': // NestJS 'log' corresponds to 'info' in many systems
      case 'info':
        activeLogLevels = ['error', 'warn', 'log'];
        break;
      case 'debug':
        activeLogLevels = ['error', 'warn', 'log', 'debug'];
        break;
      case 'verbose':
        activeLogLevels = ['error', 'warn', 'log', 'debug', 'verbose'];
        break;
      default:
        activeLogLevels = ['error', 'warn', 'log']; // Default to info level if unknown
        break;
    }
    this.setLogLevels(activeLogLevels);

    // GCP Logging specific initialization removed
    // this.cloudLogging = new Logging({
    //   projectId: this.configService.get('GCP_PROJECT_ID'),
    //   keyFilename: this.configService.get('GCP_KEY_FILE'),
    // });
  }

  // Standard log methods (log, error, warn, debug, verbose) are inherited from ConsoleLogger
  // Custom formatting or additional logic can be added by overriding these methods if needed.

  // Example of overriding to add custom prefix, though ConsoleLogger already has context
  // log(message: any, context?: string) {
  //   super.log(message, context || this.context);
  // }

  // error(message: any, trace?: string, context?: string) {
  //   super.error(message, trace, context || this.context);
  // }

  // warn(message: any, context?: string) {
  //   super.warn(message, context || this.context);
  // }

  // debug(message: any, context?: string) {
  //   super.debug(message, context || this.context);
  // }

  // verbose(message: any, context?: string) {
  //   super.verbose(message, context || this.context);
  // }

  // formatMessage and shouldLog are not directly needed as ConsoleLogger handles levels and formatting
}