"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.AppConfig = exports.LogLevel = exports.Environment = void 0;
const dotenv_1 = require("dotenv");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Staging"] = "staging";
    Environment["Production"] = "production";
})(Environment || (exports.Environment = Environment = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["Debug"] = "debug";
    LogLevel["Info"] = "info";
    LogLevel["Warn"] = "warn";
    LogLevel["Error"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class AppConfig {
    constructor() {
        (0, dotenv_1.config)();
        Object.assign(this, {
            NODE_ENV: process.env.NODE_ENV || Environment.Development,
            PORT: parseInt(process.env.PORT || '3000', 10),
            API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
            LOG_LEVEL: process.env.LOG_LEVEL || LogLevel.Info,
            RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
            RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
            JWT_SECRET: process.env.JWT_SECRET || 'development-secret',
            JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN || '86400', 10),
        });
    }
    validate() {
        const validatedConfig = (0, class_transformer_1.plainToClass)(AppConfig, this);
        const errors = (0, class_validator_1.validateSync)(validatedConfig);
        if (errors.length > 0) {
            throw new Error(`Configuration validation error: ${errors.toString()}`);
        }
    }
    isDevelopment() {
        return this.NODE_ENV === Environment.Development;
    }
    isStaging() {
        return this.NODE_ENV === Environment.Staging;
    }
    isProduction() {
        return this.NODE_ENV === Environment.Production;
    }
}
exports.AppConfig = AppConfig;
__decorate([
    (0, class_validator_1.IsEnum)(Environment),
    __metadata("design:type", String)
], AppConfig.prototype, "NODE_ENV", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AppConfig.prototype, "PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppConfig.prototype, "API_BASE_URL", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LogLevel),
    __metadata("design:type", String)
], AppConfig.prototype, "LOG_LEVEL", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AppConfig.prototype, "RATE_LIMIT_WINDOW_MS", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AppConfig.prototype, "RATE_LIMIT_MAX_REQUESTS", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppConfig.prototype, "JWT_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AppConfig.prototype, "JWT_EXPIRES_IN", void 0);
exports.appConfig = new AppConfig();
exports.appConfig.validate();
//# sourceMappingURL=app-config.js.map