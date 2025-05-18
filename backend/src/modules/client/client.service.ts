import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AdminUpdateClientDto } from './dto/admin-update-client.dto';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientDto> {
    const client = this.clientRepository.create(createClientDto);
    const savedClient = await this.clientRepository.save(client);
    return this.mapToDto(savedClient);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ items: ClientDto[], total: number, page: number, limit: number }> {
    const [clients, total] = await this.clientRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: clients.map(client => this.mapToDto(client)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ClientDto> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return this.mapToDto(client);
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<ClientDto> {
    const client = await this.findClientById(id);

    // 一般ユーザーが更新可能なフィールドのみ反映
    const { name, contactPerson, email, phoneNumber } = updateClientDto;
    Object.assign(client, {
      name: name !== undefined ? name : client.name,
      contactPerson: contactPerson !== undefined ? contactPerson : client.contactPerson,
      email: email !== undefined ? email : client.email,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : client.phoneNumber,
    });

    const updatedClient = await this.clientRepository.save(client);
    return this.mapToDto(updatedClient);
  }

  async adminUpdate(id: string, adminUpdateClientDto: AdminUpdateClientDto): Promise<ClientDto> {
    const client = await this.findClientById(id);

    // 管理者のみが更新可能な全てのフィールドを反映
    Object.assign(client, adminUpdateClientDto);

    const updatedClient = await this.clientRepository.save(client);
    return this.mapToDto(updatedClient);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findClientById(id);
    await this.clientRepository.remove(client);
  }

  private async findClientById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  private mapToDto(client: Client): ClientDto {
    return {
      id: client.id,
      name: client.name,
      contactPerson: client.contactPerson,
      email: client.email,
      phoneNumber: client.phoneNumber,
      address: client.address,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}