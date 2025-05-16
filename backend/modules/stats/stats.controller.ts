import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StatsService } from './stats.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '統計データの取得' })
  @ApiResponse({ status: 200, description: '統計データを返却' })
  async getStats(@Query() query: any) {
    return this.statsService.getStats(query);
  }

  @Get('timeseries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '期間指定の時系列統計データ取得' })
  @ApiResponse({ status: 200, description: '時系列統計データを返却' })
  async getTimeSeriesData(@Query() query: { startDate: string; endDate: string; metric: string; groupBy?: string }) {
    return this.statsService.getTimeSeriesData(query);
  }

  @Get('exhibitions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: '展示会ごとの統計データ取得' })
  @ApiParam({ name: 'id', description: '展示会ID' })
  @ApiResponse({ status: 200, description: '展示会の統計データを返却' })
  async getExhibitionStats(@Query('id') exhibitionId: string) {
    return this.statsService.getExhibitionStats(exhibitionId);
  }
}