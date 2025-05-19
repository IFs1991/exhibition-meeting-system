import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { CreateProfileDto } from '../dto/profile.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('profile')
  @ApiOperation({ summary: 'Supabase Authで作成されたユーザーのプロファイル作成' })
  @ApiResponse({ status: 201, description: 'プロファイル作成成功' })
  @ApiResponse({ status: 400, description: 'リクエストが無効です' })
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.userService.createProfile(createProfileDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '現在のユーザープロファイル取得' })
  @ApiResponse({ status: 200, description: 'プロファイル取得成功' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  async getProfile(@Body('user') user: any) {
    return this.userService.findProfileById(user.id);
  }
}