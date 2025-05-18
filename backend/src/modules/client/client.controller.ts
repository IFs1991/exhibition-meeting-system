import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe, UseGuards, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AdminUpdateClientDto } from './dto/admin-update-client.dto';
import { ClientDto } from './dto/client.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('clients')
@Controller('clients')
@UseGuards(RolesGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'The client has been successfully created.', type: ClientDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  async create(@Body() createClientDto: CreateClientDto): Promise<ClientDto> {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EXHIBITOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients.', type: [ClientDto] })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient permissions.' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ): Promise<{ items: ClientDto[], total: number, page: number, limit: number }> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.clientService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EXHIBITOR, UserRole.CLIENT)
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Return the client.', type: ClientDto })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Insufficient permissions.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ClientDto> {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CLIENT)
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'The client has been successfully updated.', type: ClientDto })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin or client role required.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto
  ): Promise<ClientDto> {
    return this.clientService.update(id, updateClientDto);
  }

  @Patch(':id/admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin update for a client' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'The client has been successfully updated.', type: ClientDto })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  async adminUpdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() adminUpdateClientDto: AdminUpdateClientDto
  ): Promise<ClientDto> {
    return this.clientService.adminUpdate(id, adminUpdateClientDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'The client has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin role required.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.clientService.remove(id);
  }
}