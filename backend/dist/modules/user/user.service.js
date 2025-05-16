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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_repository_1 = require("./repositories/user.repository");
const app_config_1 = require("../config/app-config");
const identity_platform_1 = require("@google-cloud/identity-platform");
let UserService = class UserService {
    constructor(userRepository, jwtService, appConfig, configService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.appConfig = appConfig;
        this.configService = configService;
        this.identityClient = new identity_platform_1.IdentityPlatformClient({
            projectId: this.appConfig.googleProjectId,
        });
    }
    async register(createUserDto) {
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('メールアドレスは既に登録されています');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const identityUser = await this.identityClient.createUser({
            email: createUserDto.email,
            password: createUserDto.password,
            displayName: createUserDto.name,
        });
        const user = await this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
            identityUid: identityUser.uid,
        });
        return this.sanitizeUser(user);
    }
    async validateToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            if (!payload.sub) {
                throw new common_1.UnauthorizedException('Invalid token payload');
            }
            const user = await this.userRepository.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.sanitizeUser(user);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async login(loginDto) {
        const user = await this.userRepository.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('認証情報が正しくありません');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('認証情報が正しくありません');
        }
        const token = this.generateToken(user);
        return { token, user: this.sanitizeUser(user) };
    }
    async updateProfile(userId, updateDto) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('ユーザーが見つかりません');
        }
        await this.identityClient.updateUser(user.identityUid, {
            displayName: updateDto.name,
        });
        const updatedUser = await this.userRepository.update(userId, updateDto);
        return this.sanitizeUser(updatedUser);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('ユーザーが見つかりません');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('現在のパスワードが正しくありません');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.identityClient.updateUser(user.identityUid, {
            password: newPassword,
        });
        await this.userRepository.update(userId, { password: hashedPassword });
    }
    async findById(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return null;
        }
        return this.sanitizeUser(user);
    }
    async validateUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('ユーザーが見つかりません');
        }
        return this.sanitizeUser(user);
    }
    async validateToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            if (!payload.sub) {
                throw new common_1.UnauthorizedException('Invalid token payload');
            }
            const user = await this.userRepository.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.sanitizeUser(user);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
    sanitizeUser(user) {
        const sanitized = { ...user };
        delete sanitized.password;
        delete sanitized.identityUid;
        return sanitized;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof app_config_1.AppConfig !== "undefined" && app_config_1.AppConfig) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], UserService);
//# sourceMappingURL=user.service.js.map