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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RateLimiterMiddleware = class RateLimiterMiddleware {
    constructor(configService) {
        this.configService = configService;
        this.redis = new ioredis_1.Redis(this.configService.get('REDIS_URL'));
        this.windowMs = this.configService.get('RATE_LIMIT_WINDOW_MS', 60000);
        this.maxRequestsPerIp = this.configService.get('RATE_LIMIT_MAX_IP', 100);
        this.maxRequestsPerUser = this.configService.get('RATE_LIMIT_MAX_USER', 1000);
        this.endpointLimits = new Map([
            ['/api/ai/generate', 10],
            ['/api/receipt/search', 50],
            ['/api/stats/*', 20]
        ]);
    }
    async use(req, res, next) {
        const ip = req.ip;
        const userId = req.user?.id || 'anonymous';
        const endpoint = req.path;
        const ipKey = `ratelimit:ip:${ip}`;
        const userKey = `ratelimit:user:${userId}`;
        const endpointKey = `ratelimit:${userId}:${endpoint}`;
        try {
            const [ipRequests, userRequests, endpointRequests] = await Promise.all([
                this.redis.incr(ipKey),
                this.redis.incr(userKey),
                this.redis.incr(endpointKey)
            ]);
            const isIpLimited = ipRequests > this.maxRequestsPerIp;
            const isUserLimited = userRequests > this.maxRequestsPerUser;
            const isEndpointLimited = this.checkEndpointLimit(endpoint, endpointRequests);
            if (isIpLimited || isUserLimited || isEndpointLimited) {
                return res.status(429).json({
                    error: 'Too Many Requests',
                    message: 'リクエスト制限を超過しました。しばらく待ってから再試行してください。',
                    retryAfter: Math.ceil(this.windowMs / 1000)
                });
            }
            await Promise.all([
                this.redis.expire(ipKey, this.windowMs / 1000),
                this.redis.expire(userKey, this.windowMs / 1000),
                this.redis.expire(endpointKey, this.windowMs / 1000)
            ]);
            next();
        }
        catch (error) {
            next(error);
        }
    }
    checkEndpointLimit(endpoint, requests) {
        for (const [pattern, limit] of this.endpointLimits) {
            if (endpoint.startsWith(pattern.replace('*', ''))) {
                return requests > limit;
            }
        }
        return false;
    }
};
exports.RateLimiterMiddleware = RateLimiterMiddleware;
exports.RateLimiterMiddleware = RateLimiterMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RateLimiterMiddleware);
//# sourceMappingURL=rate-limiter.middleware.js.map