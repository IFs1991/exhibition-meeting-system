import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto, UpdateExhibitionDto } from './dto/exhibition.dto';
import { AuthGuard } from '../user/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('exhibitions')
@UseGuards(AuthGuard)
@Controller('exhibitions')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  @Post()
  @ApiOperation({ summary: '新しい展示会を作成' })
  @ApiResponse({ status: 201, description: '展示会が正常に作成されました' })
  create(@Body() createExhibitionDto: CreateExhibitionDto) {
    return this.exhibitionService.create(createExhibitionDto);
  }

  @Get()
  @ApiOperation({ summary: '全ての展示会を取得' })
  @ApiResponse({ status: 200, description: '展示会の一覧を返却' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.exhibitionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '指定IDの展示会を取得' })
  @ApiParam({ name: 'id', description: '展示会ID' })
  @ApiResponse({ status: 200, description: '展示会の詳細情報を返却' })
  findOne(@Param('id') id: string) {
    return this.exhibitionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '展示会情報を更新' })
  @ApiParam({ name: 'id', description: '展示会ID' })
  @ApiResponse({ status: 200, description: '展示会が正常に更新されました' })
  update(@Param('id') id: string, @Body() updateExhibitionDto: UpdateExhibitionDto) {
    return this.exhibitionService.update(id, updateExhibitionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '展示会を削除' })
  @ApiParam({ name: 'id', description: '展示会ID' })
  @ApiResponse({ status: 200, description: '展示会が正常に削除されました' })
  remove(@Param('id') id: string) {
    return this.exhibitionService.remove(id);
  }

  @Get(':id/clients')
  @ApiOperation({ summary: '展示会に関連するクライアント一覧を取得' })
  @ApiParam({ name: 'id', description: '展示会ID' })
  @ApiResponse({ status: 200, description: 'クライアント一覧を返却' })
  getRelatedClients(@Param('id') id: string, @Query() query: PaginationQueryDto) {
    return this.exhibitionService.getRelatedClients(id, query);
  }

  @Get(':id/meetings')
  @ApiOperation({ summary: '展示会に関連する商談予約一覧を取得' })
  @ApiParam({ name: 'id', description: '展示会ID' })
  @ApiResponse({ status: 200, description: '商談予約一覧を返却' })
  getScheduledMeetings(@Param('id') id: string, @Query() query: PaginationQueryDto) {
    return this.exhibitionService.getScheduledMeetings(id, query);
  }

  @Post(':exhibitionId/clients/:clientId')
  @ApiOperation({ summary: 'クライアントを展示会に登録' })
  @ApiParam({ name: 'exhibitionId', description: '展示会ID' })
  @ApiParam({ name: 'clientId', description: 'クライアントID' })
  @ApiResponse({ status: 201, description: 'クライアントが正常に登録されました' })
  addClient(
    @Param('exhibitionId') exhibitionId: string,
    @Param('clientId') clientId: string,
    @Body() data: any
  ) {
    return this.exhibitionService.addClient(exhibitionId, clientId, data);
  }

  @Delete(':exhibitionId/clients/:clientId')
  @ApiOperation({ summary: 'クライアントの展示会登録を解除' })
  @ApiParam({ name: 'exhibitionId', description: '展示会ID' })
  @ApiParam({ name: 'clientId', description: 'クライアントID' })
  @ApiResponse({ status: 200, description: 'クライアントの登録が正常に解除されました' })
  removeClient(
    @Param('exhibitionId') exhibitionId: string,
    @Param('clientId') clientId: string
  ) {
    return this.exhibitionService.removeClient(exhibitionId, clientId);
  }
}