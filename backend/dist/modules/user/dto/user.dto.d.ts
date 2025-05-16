export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    clinicName?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class UpdateProfileDto {
    username?: string;
    clinicName?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
}
