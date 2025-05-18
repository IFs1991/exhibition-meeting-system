import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { AdminUpdateExhibitionDto } from './dto/admin-update-exhibition.dto';
import { ExhibitionDto } from './dto/exhibition.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('exhibitions')
@Controller('exhibitions')
@UseGuards(RolesGuard)
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EXHIBITOR)
  @ApiOperation({ summary: '新しい展示会を作成' })
  @ApiResponse({ status: 201, description: '展示会が正常に作成されました', type: ExhibitionDto })
  @ApiResponse({ status: 400, description: '無効な入力' })
  @ApiResponse({ status: 403, description: 'アクセス権限がありません' })
  async create(@Body() createExhibitionDto: CreateExhibitionDto): Promise<ExhibitionDto> {
    return this.exhibitionService.create(createExhibitionDto);
  }

  @Get()
  @ApiOperation({ summary: '全ての展示会を取得' })
  @ApiQuery({ name: 'page', required: false, description: 'ページ番号' })
  @ApiQuery({ name: 'limit', required: false, description: '1ページあたりの件数' })
  @ApiQuery({ name: 'isPublic', required: false, description: '公開ステータスでフィルタリング' })
  @ApiResponse({ status: 200, description: '展示会一覧を返却', type: [ExhibitionDto] })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('isPublic') isPublic?: string,
  ): Promise<{ items: ExhibitionDto[], total: number, page: number, limit: number }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const isPublicFilter = isPublic === 'true' ? true : isPublic === 'false' ? false : undefined;

    return this.exhibitionService.findAll(pageNumber, limitNumber, isPublicFilter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'IDで展示会を取得' })
  @ApiParam({ name: 'id', description: '展示会ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: '展示会情報を返却', type: ExhibitionDto })
  @ApiResponse({ status: 404, description: '展示会が見つかりません' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ExhibitionDto> {
    return this.exhibitionService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EXHIBITOR)
  @ApiOperation({ summary: '展示会情報を更新' })
  @ApiParam({ name: 'id', description: '展示会ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: '展示会が正常に更新されました', type: ExhibitionDto })
  @ApiResponse({ status: 404, description: '展示会が見つかりません' })
  @ApiResponse({ status: 403, description: 'アクセス権限がありません' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExhibitionDto: UpdateExhibitionDto,
  ): Promise<ExhibitionDto> {
    return this.exhibitionService.update(id, updateExhibitionDto);
  }

  @Patch(':id/admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '管理者用展示会情報更新（拡張機能）' })
  @ApiParam({ name: 'id', description: '展示会ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: '展示会が正常に更新されました', type: ExhibitionDto })
  @ApiResponse({ status: 404, description: '展示会が見つかりません' })
  @ApiResponse({ status: 403, description: 'アクセス権限がありません' })
  async adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() adminUpdateExhibitionDto: AdminUpdateExhibitionDto,
  ): Promise<ExhibitionDto> {
    return this.exhibitionService.adminUpdate(id, adminUpdateExhibitionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '展示会を削除' })
  @ApiParam({ name: 'id', description: '展示会ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: '展示会が正常に削除されました' })
  @ApiResponse({ status: 404, description: '展示会が見つかりません' })
  @ApiResponse({ status: 403, description: 'アクセス権限がありません' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.exhibitionService.remove(id);
  }
}