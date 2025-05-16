import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { AppConfig } from '../config/app-config';
import { User, CreateUserDto, UpdateProfileDto, LoginDto } from './dto/user.dto'; // Assuming User DTO
import { IdentityPlatformClient } from '@google-cloud/identity-platform';

@Injectable()
export class UserService {
  private readonly identityClient: IdentityPlatformClient;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly appConfig: AppConfig, // Assuming AppConfig provides googleProjectId
    private readonly configService: ConfigService, // Injected ConfigService
  ) {
    this.identityClient = new IdentityPlatformClient({
      projectId: this.appConfig.googleProjectId,
    });
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('メールアドレスは既に登録されています');
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

    return this.sanitizeUser(user as any);
  }

  async validateToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // Ensure payload has 'sub' (user id)
      if (!payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.sanitizeUser(user as any); // Cast to any if repository User and DTO User differ
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: User }> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('認証情報が正しくありません');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('認証情報が正しくありません');
    }

    const token = this.generateToken(user);
    return { token, user: this.sanitizeUser(user) };
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('ユーザーが見つかりません');
    }

    await this.identityClient.updateUser(user.identityUid, {
      displayName: updateDto.name,
    });

    const updatedUser = await this.userRepository.update(userId, updateDto);
    return this.sanitizeUser(updatedUser);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('ユーザーが見つかりません');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('現在のパスワードが正しくありません');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.identityClient.updateUser(user.identityUid, {
      password: newPassword,
    });

    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }
    return this.sanitizeUser(user as any); // Cast to any if repository User and DTO User differ significantly
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('ユーザーが見つかりません');
    }
    return this.sanitizeUser(user as any);
  }

  async validateToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // Ensure payload has 'sub' (user id)
      if (!payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.sanitizeUser(user as any); // Cast to any if repository User and DTO User differ
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User): User {
    const sanitized = { ...user };
    delete sanitized.password;
    delete sanitized.identityUid;
    return sanitized;
  }
}