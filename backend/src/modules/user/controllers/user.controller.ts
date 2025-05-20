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
  NotFoundException,
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

  // @Post()
  // @Roles(UserRole.ADMIN)
  // @ApiOperation({ summary: '新規ユーザー作成 (管理者専用)' })
  // @ApiResponse({ status: 201, description: 'ユーザーが正常に作成されました' })
  // @ApiResponse({ status: 400, description: 'リクエストが無効です' })
  // @ApiResponse({ status: 401, description: '認証エラー' })
  // @ApiResponse({ status: 403, description: '権限エラー' })
  // async create(@Body() createUserDto: CreateUserDto) {
  //   // return this.userService.createUser(createUserDto); // createUserは存在しない
  //   // Supabaseでユーザー作成後、そのIDを使ってProfileを作成する想定
  //   // このAPIの役割を再検討する必要あり
  //   throw new Error('Not implemented yet. Profile creation should be linked to Supabase user creation.');
  // }

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
    const profile = await this.userService.findProfileById(id);
    if (!profile) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // const { passwordHash, ...result } = user; // passwordHash は Profile にない
    return profile; // Profileオブジェクトをそのまま返す
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
    return this.userService.updateProfile(id, updateUserDto);
  }

  // @Delete(':id')
  // @Roles(UserRole.ADMIN)
  // @ApiOperation({ summary: 'ユーザー削除 (管理者専用)' })
  // @ApiParam({ name: 'id', description: 'ユーザーID' })
  // @ApiResponse({ status: 200, description: 'ユーザーを削除しました' })
  // @ApiResponse({ status: 404, description: 'ユーザーが見つかりません' })
  // @ApiResponse({ status: 401, description: '認証エラー' })
  // @ApiResponse({ status: 403, description: '権限エラー' })
  // async remove(@Param('id', ParseUUIDPipe) id: string) {
  //   // await this.userService.softRemove(id); // softRemoveは存在しない
  //   // Supabaseユーザーの削除/無効化処理が必要
  //   // throw new Error('Not implemented yet. User deletion needs to interact with Supabase.');
  //   return { message: 'User deletion not implemented yet.' };
  // }

  // @Post(':id/change-password')
  // @Roles(UserRole.ADMIN, UserRole.EXHIBITOR, UserRole.CLIENT, UserRole.USER)
  // @ApiOperation({ summary: 'パスワード変更' })
  // @ApiParam({ name: 'id', description: 'ユーザーID' })
  // @ApiResponse({ status: 200, description: 'パスワードを変更しました' })
  // @ApiResponse({ status: 400, description: '現在のパスワードが正しくありません' })
  // @ApiResponse({ status: 404, description: 'ユーザーが見つかりません' })
  // @ApiResponse({ status: 401, description: '認証エラー' })
  // async changePassword(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() changePasswordDto: ChangePasswordDto,
  // ) {
  //   // await this.userService.changePassword(
  //   //   id,
  //   //   changePasswordDto.currentPassword,
  //   //   changePasswordDto.newPassword,
  //   // ); // changePasswordは存在しない
  //   // パスワード変更はSupabase側で行う
  //   // throw new Error('Not implemented yet. Password change should be handled by Supabase.');
  //   return { message: 'Password change not implemented yet.' };
  // }
}
