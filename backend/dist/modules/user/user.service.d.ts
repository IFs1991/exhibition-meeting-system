import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './repositories/user.repository';
import { AppConfig } from '../config/app-config';
import { User, CreateUserDto, UpdateProfileDto, LoginDto } from './dto/user.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly appConfig;
    private readonly configService;
    private readonly identityClient;
    constructor(userRepository: UserRepository, jwtService: JwtService, appConfig: AppConfig, configService: ConfigService);
    register(createUserDto: CreateUserDto): Promise<User>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: User;
    }>;
    updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<User>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    findById(userId: string): Promise<User | null>;
    validateUser(userId: string): Promise<User>;
    private generateToken;
    private sanitizeUser;
}
