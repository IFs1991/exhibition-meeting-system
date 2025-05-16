import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReceiptService } from './receipt.service';
import { CreateReceiptDto, UpdateReceiptDto, SearchReceiptDto, TagManagementDto } from './dto/receipt.dto';
import { AuthGuard } from '../user/guards/auth.guard';

@ApiTags('receipts')
@Controller('receipts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @ApiOperation({ summary: '事例登録' })
  @ApiResponse({ status: 201, description: '事例が正常に登録されました' })
  async createReceipt(@Body(ValidationPipe) createReceiptDto: CreateReceiptDto) {
    return await this.receiptService.createReceipt(createReceiptDto);
  }

  @Get('search')
  @ApiOperation({ summary: '事例検索' })
  @ApiResponse({ status: 200, description: '検索結果を返却' })
  async searchReceipts(@Query(ValidationPipe) searchDto: SearchReceiptDto) {
    return await this.receiptService.searchReceipts(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '事例詳細取得' })
  @ApiResponse({ status: 200, description: '事例詳細を返却' })
  async getReceipt(@Param('id') id: string) {
    return await this.receiptService.getReceiptById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '事例更新' })
  @ApiResponse({ status: 200, description: '事例が正常に更新されました' })
  async updateReceipt(
    @Param('id') id: string,
    @Body(ValidationPipe) updateReceiptDto: UpdateReceiptDto
  ) {
    return await this.receiptService.updateReceipt(id, updateReceiptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '事例削除' })
  @ApiResponse({ status: 200, description: '事例が正常に削除されました' })
  async deleteReceipt(@Param('id') id: string) {
    return await this.receiptService.deleteReceipt(id);
  }

  @Post('tags')
  @ApiOperation({ summary: 'タグ管理' })
  @ApiResponse({ status: 201, description: 'タグが正常に処理されました' })
  async manageTags(@Body(ValidationPipe) tagDto: TagManagementDto) {
    return await this.receiptService.manageTags(tagDto);
  }

  @Get('tags/suggestions')
  @ApiOperation({ summary: 'タグ候補取得' })
  @ApiResponse({ status: 200, description: 'タグ候補を返却' })
  async getTagSuggestions(@Query('keyword') keyword: string) {
    return await this.receiptService.getTagSuggestions(keyword);
  }
}