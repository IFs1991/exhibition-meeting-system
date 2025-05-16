import { Controller, Post, Body, Get, Patch, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateProfileDto, LoginDto } from './dto/user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    // Assuming user information is attached to the request by AuthGuard
    // The actual structure of req.user depends on how AuthGuard is implemented
    const userId = (req as any).user?.id; // Adjust based on your AuthGuard
    if (!userId) {
      // This case should ideally be handled by AuthGuard returning 401/403
      // or provide a more specific error if user is somehow undefined after guard
      throw new Error('User not authenticated or user ID not found');
    }
    return this.userService.findById(userId);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = (req as any).user?.id; // Adjust based on your AuthGuard
    if (!userId) {
      throw new Error('User not authenticated or user ID not found');
    }
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  // Potential logout endpoint - implementation depends on auth strategy (e.g., token invalidation)
  // @UseGuards(AuthGuard)
  // @Post('logout')
  // async logout(@Req() req: Request) {
  //   // For JWT, logout is typically handled client-side by deleting the token.
  //   // If using session-based auth or a token blacklist, implement server-side logic here.
  //   return { message: 'Logout successful' };
  // }
}