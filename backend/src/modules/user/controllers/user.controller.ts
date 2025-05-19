import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../entities/user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UserPaginationDto,
} from '../dto/user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('Supabase-JWT')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '新規ユーザー作成 (管理者専用)' })
  @ApiResponse({ status: 201, description: 'ユーザーが正常に作成されました' })
  @ApiResponse({ status: 400, description: 'リクエストが無効です' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  @ApiResponse({ status: 403, description: '権限エラー' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'ユーザー一覧取得 (管理者専用)' })
  @ApiResponse({ status: 200, description: 'ユーザー一覧を取得しました' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  @ApiResponse({ status: 403, description: '権限エラー' })
  async findAll(@Query(ValidationPipe) query: UserPaginationDto) {
    return this.userService.findAllWithPagination(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EXHIBITOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'ユーザー詳細取得' })
  @ApiParam({ name: 'id', description: 'ユーザーID' })
  @ApiResponse({ status: 200, description: 'ユーザー詳細を取得しました' })
  @ApiResponse({ status: 404, description: 'ユーザーが見つかりません' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findOneByIdOrFail(id);
    const { passwordHash, ...result } = user;
    return result;
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'ユーザー情報更新 (管理者専用)' })
  @ApiParam({ name: 'id', description: 'ユーザーID' })
  @ApiResponse({ status: 200, description: 'ユーザー情報を更新しました' })
  @ApiResponse({ status: 404, description: 'ユーザーが見つかりません' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  @ApiResponse({ status: 403, description: '権限エラー' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'ユーザー削除 (管理者専用)' })
  @ApiParam({ name: 'id', description: 'ユーザーID' })
  @ApiResponse({ status: 200, description: 'ユーザーを削除しました' })
  @ApiResponse({ status: 404, description: 'ユーザーが見つかりません' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  @ApiResponse({ status: 403, description: '権限エラー' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.softRemove(id);
    return { message: 'ユーザーが正常に削除されました' };
  }

  @Post(':id/change-password')
  @Roles(UserRole.ADMIN, UserRole.EXHIBITOR, UserRole.CLIENT, UserRole.USER)
  @ApiOperation({ summary: 'パスワード変更' })
  @ApiParam({ name: 'id', description: 'ユーザーID' })
  @ApiResponse({ status: 200, description: 'パスワードを変更しました' })
  @ApiResponse({ status: 400, description: '現在のパスワードが正しくありません' })
  @ApiResponse({ status: 404, description: 'ユーザーが見つかりません' })
  @ApiResponse({ status: 401, description: '認証エラー' })
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.userService.changePassword(
      id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'パスワードが正常に変更されました' };
  }
}
