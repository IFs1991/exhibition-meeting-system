export declare enum Environment {
    Development = "development",
    Staging = "staging",
    Production = "production"
}
export declare enum LogLevel {
    Debug = "debug",
    Info = "info",
    Warn = "warn",
    Error = "error"
}
export declare class AppConfig {
    NODE_ENV: Environment;
    PORT: number;
    API_BASE_URL: string;
    LOG_LEVEL: LogLevel;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: number;
    constructor();
    validate(): void;
    isDevelopment(): boolean;
    isStaging(): boolean;
    isProduction(): boolean;
}
export declare const appConfig: AppConfig;
