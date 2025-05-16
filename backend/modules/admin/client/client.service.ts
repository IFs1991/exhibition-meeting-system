import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/client.entity'; // Assuming entity path
import { CreateClientDto, UpdateClientDto } from '../dto/client.dto'; // Assuming DTO path

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Client[], count: number }> {
    const [data, count] = await this.clientRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id); // Reuse findOne to ensure client exists
    // Merge existing client with update DTO. TypeORM's save can also handle partial updates.
    this.clientRepository.merge(client, updateClientDto);
    return this.clientRepository.save(client);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id); // Reuse findOne to ensure client exists
    await this.clientRepository.remove(client);
    // Or, for soft delete if implemented in entity:
    // client.deletedAt = new Date();
    // await this.clientRepository.save(client);
  }
}