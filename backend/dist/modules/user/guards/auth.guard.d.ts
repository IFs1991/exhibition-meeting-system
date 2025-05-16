import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';
export declare class AuthGuard implements CanActivate {
    private readonly userService;
    private readonly reflector;
    constructor(userService: UserService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
export declare const Public: () => (target: any, key?: string | symbol, descriptor?: PropertyDescriptor) => void;
