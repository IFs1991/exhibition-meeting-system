import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class RateLimiterMiddleware implements NestMiddleware {
    private configService;
    private readonly redis;
    private readonly windowMs;
    private readonly maxRequestsPerIp;
    private readonly maxRequestsPerUser;
    private readonly endpointLimits;
    constructor(configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    private checkEndpointLimit;
}
