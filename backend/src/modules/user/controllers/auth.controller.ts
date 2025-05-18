import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto, CreateUserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../../shared/guards/auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'ユーザーログイン' })
  @ApiResponse({ status: 200, description: 'ログイン成功' })
  @ApiResponse({ status: 401, description: '認証失敗' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'ユーザー登録（クライアント・出展者）' })
  @ApiResponse({ status: 201, description: 'ユーザー登録成功' })
  @ApiResponse({ status: 400, description: 'リクエストが無効です' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '現在のユーザープロファイル取得' })
  @ApiResponse({ status: 200, description: 'プロファイル取得成功' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  async getProfile(@Body('user') user: any) {
    const { passwordHash, ...result } = user;
    return result;
  }
}