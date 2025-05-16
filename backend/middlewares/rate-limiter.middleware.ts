import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly redis: Redis;
  private readonly windowMs: number;
  private readonly maxRequestsPerIp: number;
  private readonly maxRequestsPerUser: number;
  private readonly endpointLimits: Map<string, number>;

  constructor(private configService: ConfigService) {
    this.redis = new Redis(this.configService.get('REDIS_URL'));
    this.windowMs = this.configService.get('RATE_LIMIT_WINDOW_MS', 60000);
    this.maxRequestsPerIp = this.configService.get('RATE_LIMIT_MAX_IP', 100);
    this.maxRequestsPerUser = this.configService.get('RATE_LIMIT_MAX_USER', 1000);
    
    this.endpointLimits = new Map([
      ['/api/ai/generate', 10],
      ['/api/receipt/search', 50],
      ['/api/stats/*', 20]
    ]);
  }

  async use(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
      next(error);
    }
  }

  private checkEndpointLimit(endpoint: string, requests: number): boolean {
    for (const [pattern, limit] of this.endpointLimits) {
      if (endpoint.startsWith(pattern.replace('*', ''))) {
        return requests > limit;
      }
    }
    return false;
  }
}