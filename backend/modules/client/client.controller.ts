import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDto } from './dto/client.dto'; // ClientDto をインポート
import { Client } from '../entities/client.entity'; // Clientエンティティをインポート
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'; // Swaggerデコレータをインポート

@ApiTags('clients') // Swagger UIでのタグ名
@Controller('clients') // ルートパスを 'clients' に変更
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'The client has been successfully created.', type: ClientDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createClientDto: CreateClientDto): Promise<ClientDto> {
    const client = await this.clientService.create(createClientDto);
    return this.mapToDto(client); // DTOにマッピング
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Return all clients.', type: [ClientDto] })
  async findAll(): Promise<ClientDto[]> {
    const clients = await this.clientService.findAll();
    return clients.map(client => this.mapToDto(client)); // DTOにマッピング
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Return the client.', type: ClientDto })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ClientDto> {
    const client = await this.clientService.findOne(id);
    return this.mapToDto(client); // DTOにマッピング
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'The client has been successfully updated.', type: ClientDto })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClientDto: UpdateClientDto): Promise<ClientDto> {
    const client = await this.clientService.update(id, updateClientDto);
    return this.mapToDto(client); // DTOにマッピング
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'The client has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.clientService.remove(id);
  }

  // EntityをDTOにマッピングするヘルパーメソッド
  private mapToDto(client: Client): ClientDto {
    return {
      id: client.id,
      name: client.name,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}