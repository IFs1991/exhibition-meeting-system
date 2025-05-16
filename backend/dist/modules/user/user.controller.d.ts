import { UserService } from './user.service';
import { CreateUserDto, UpdateProfileDto, LoginDto } from './dto/user.dto';
import { Request } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: CreateUserDto): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: User;
    }>;
    getProfile(req: Request): Promise<any>;
    updateProfile(req: Request, updateProfileDto: UpdateProfileDto): Promise<User>;
}
