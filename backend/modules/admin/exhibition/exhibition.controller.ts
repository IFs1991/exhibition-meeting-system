import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto, UpdateExhibitionDto } from '../dto/exhibition.dto'; // Assuming DTO path
import { AdminAuthGuard } from '../../auth/guards/admin-auth.guard'; // Assuming a general admin guard

@UseGuards(AdminAuthGuard) // Secure all routes in this controller
@Controller('admin/exhibitions')
export class ExhibitionController {
  constructor(private readonly exhibitionService: ExhibitionService) {}

  @Post()
  async create(@Body() createExhibitionDto: CreateExhibitionDto) {
    return this.exhibitionService.create(createExhibitionDto);
  }

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.exhibitionService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.exhibitionService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExhibitionDto: UpdateExhibitionDto) {
    return this.exhibitionService.update(id, updateExhibitionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.exhibitionService.remove(id);
  }
}