import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Exhibition } from '../../entities/exhibition.entity';
import { Client } from '../../entities/client.entity';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { AdminUpdateExhibitionDto } from './dto/admin-update-exhibition.dto';
import { ExhibitionDto } from './dto/exhibition.dto';

@Injectable()
export class ExhibitionService {
  constructor(
    @InjectRepository(Exhibition)
    private readonly exhibitionRepository: Repository<Exhibition>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createExhibitionDto: CreateExhibitionDto): Promise<ExhibitionDto> {
    const exhibition = this.exhibitionRepository.create({
      ...createExhibitionDto,
      startDate: new Date(createExhibitionDto.startDate),
      endDate: new Date(createExhibitionDto.endDate),
    });

    const savedExhibition = await this.exhibitionRepository.save(exhibition);
    return this.mapToDto(savedExhibition);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    isPublic?: boolean,
  ): Promise<{ items: ExhibitionDto[], total: number, page: number, limit: number }> {
    const queryBuilder = this.exhibitionRepository.createQueryBuilder('exhibition')
      .leftJoinAndSelect('exhibition.clients', 'clients')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('exhibition.startDate', 'DESC');

    if (isPublic !== undefined) {
      queryBuilder.andWhere('exhibition.isPublic = :isPublic', { isPublic });
    }

    const [exhibitions, total] = await queryBuilder.getManyAndCount();

    return {
      items: exhibitions.map(exhibition => this.mapToDto(exhibition)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ExhibitionDto> {
    const exhibition = await this.exhibitionRepository.findOne({
      where: { id },
      relations: ['clients'],
    });

    if (!exhibition) {
      throw new NotFoundException(`展示会 ID ${id} が見つかりません`);
    }

    return this.mapToDto(exhibition);
  }

  async update(id: string, updateExhibitionDto: UpdateExhibitionDto): Promise<ExhibitionDto> {
    const exhibition = await this.findExhibitionById(id);

    // 一般ユーザーが更新可能なフィールドのみ処理
    const {
      name, description, startDate, endDate, location, additionalInfo
    } = updateExhibitionDto;

    if (name !== undefined) exhibition.name = name;
    if (description !== undefined) exhibition.description = description;
    if (startDate !== undefined) exhibition.startDate = new Date(startDate);
    if (endDate !== undefined) exhibition.endDate = new Date(endDate);
    if (location !== undefined) exhibition.location = location;
    if (additionalInfo !== undefined) exhibition.additionalInfo = additionalInfo;

    const updatedExhibition = await this.exhibitionRepository.save(exhibition);
    return this.mapToDto(updatedExhibition);
  }

  async adminUpdate(id: string, adminUpdateDto: AdminUpdateExhibitionDto): Promise<ExhibitionDto> {
    const exhibition = await this.findExhibitionById(id);

    // 管理者が更新可能な全てのフィールドを処理
    const {
      name, description, startDate, endDate, location,
      isPublic, additionalInfo, clientIds
    } = adminUpdateDto;

    if (name !== undefined) exhibition.name = name;
    if (description !== undefined) exhibition.description = description;
    if (startDate !== undefined) exhibition.startDate = new Date(startDate);
    if (endDate !== undefined) exhibition.endDate = new Date(endDate);
    if (location !== undefined) exhibition.location = location;
    if (isPublic !== undefined) exhibition.isPublic = isPublic;
    if (additionalInfo !== undefined) exhibition.additionalInfo = additionalInfo;

    // クライアント関連の更新（管理者専用機能）
    if (clientIds && clientIds.length > 0) {
      const clients = await this.clientRepository.find({
        where: { id: In(clientIds) }
      });

      if (clients.length !== clientIds.length) {
        throw new NotFoundException('一部のクライアントIDが見つかりません');
      }

      exhibition.clients = clients;
    }

    const updatedExhibition = await this.exhibitionRepository.save(exhibition);
    return this.mapToDto(updatedExhibition);
  }

  async remove(id: string): Promise<void> {
    const exhibition = await this.findExhibitionById(id);
    await this.exhibitionRepository.remove(exhibition);
  }

  private async findExhibitionById(id: string): Promise<Exhibition> {
    const exhibition = await this.exhibitionRepository.findOne({
      where: { id },
      relations: ['clients'],
    });

    if (!exhibition) {
      throw new NotFoundException(`展示会 ID ${id} が見つかりません`);
    }

    return exhibition;
  }

  private mapToDto(exhibition: Exhibition): ExhibitionDto {
    return {
      id: exhibition.id,
      name: exhibition.name,
      description: exhibition.description,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate,
      location: exhibition.location,
      isPublic: exhibition.isPublic,
      additionalInfo: exhibition.additionalInfo,
      clients: exhibition.clients?.map(client => ({
        id: client.id,
        name: client.name,
        contactPerson: client.contactPerson,
        email: client.email,
        phoneNumber: client.phoneNumber,
        address: client.address,
        isActive: client.isActive,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      })),
      createdAt: exhibition.createdAt,
      updatedAt: exhibition.updatedAt,
    };
  }
}