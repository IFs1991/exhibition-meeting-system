import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExhibitionDto, UpdateExhibitionDto } from './dto/exhibition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ExhibitionService {
  constructor(
    @InjectRepository(Exhibition)
    private exhibitionRepository: Repository<Exhibition>,
    @InjectRepository('Client')
    private clientRepository: Repository<any>,
    @InjectRepository('Meeting')
    private meetingRepository: Repository<any>,
  ) {}

  async create(createExhibitionDto: CreateExhibitionDto): Promise<Exhibition> {
    const exhibition = this.exhibitionRepository.create(createExhibitionDto);
    return this.exhibitionRepository.save(exhibition);
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, sort, order = 'asc' } = query;
    const skip = (page - 1) * limit;

    const orderOptions = sort ? { [sort]: order } : { createdAt: 'DESC' };

    const [exhibitions, total] = await this.exhibitionRepository.findAndCount({
      take: limit,
      skip,
      order: orderOptions,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      exhibitions,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Exhibition> {
    const exhibition = await this.exhibitionRepository.findOne({ where: { id } });

    if (!exhibition) {
      throw new NotFoundException(`展示会 ID:${id} が見つかりません`);
    }

    return exhibition;
  }

  async update(id: string, updateExhibitionDto: UpdateExhibitionDto): Promise<Exhibition> {
    const exhibition = await this.findOne(id);

    Object.assign(exhibition, updateExhibitionDto);

    return this.exhibitionRepository.save(exhibition);
  }

  async remove(id: string): Promise<void> {
    const exhibition = await this.findOne(id);

    await this.exhibitionRepository.remove(exhibition);
  }

  async getRelatedClients(id: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10, sort, order = 'asc' } = query;
    const skip = (page - 1) * limit;

    // 展示会の存在確認
    await this.findOne(id);

    // 展示会に関連するクライアントを取得するクエリ
    const [clients, total] = await this.clientRepository
      .createQueryBuilder('client')
      .innerJoin('client.exhibitions', 'exhibition')
      .where('exhibition.id = :id', { id })
      .skip(skip)
      .take(limit)
      .orderBy(sort ? `client.${sort}` : 'client.createdAt', order.toUpperCase() as 'ASC' | 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      clients,
      total,
      page,
      totalPages,
    };
  }

  async getScheduledMeetings(id: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10, sort, order = 'asc' } = query;
    const skip = (page - 1) * limit;

    // 展示会の存在確認
    await this.findOne(id);

    // 展示会に関連する商談予約を取得するクエリ
    const [meetings, total] = await this.meetingRepository
      .createQueryBuilder('meeting')
      .where('meeting.exhibitionId = :id', { id })
      .skip(skip)
      .take(limit)
      .orderBy(sort ? `meeting.${sort}` : 'meeting.scheduledAt', order.toUpperCase() as 'ASC' | 'DESC')
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      meetings,
      total,
      page,
      totalPages,
    };
  }

  async addClient(exhibitionId: string, clientId: string, data: any): Promise<void> {
    const exhibition = await this.findOne(exhibitionId);

    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`クライアント ID:${clientId} が見つかりません`);
    }

    // 展示会とクライアントの関連付け
    // この実装は実際のエンティティ構造によって異なる可能性があります
    await this.exhibitionRepository
      .createQueryBuilder()
      .relation(Exhibition, 'clients')
      .of(exhibition)
      .add(client);

    // 追加データがあれば処理
    if (data) {
      // データに基づく追加処理（例: 参加日程、ブース位置など）
    }
  }

  async removeClient(exhibitionId: string, clientId: string): Promise<void> {
    const exhibition = await this.findOne(exhibitionId);

    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new NotFoundException(`クライアント ID:${clientId} が見つかりません`);
    }

    // 展示会からクライアントの関連付けを解除
    await this.exhibitionRepository
      .createQueryBuilder()
      .relation(Exhibition, 'clients')
      .of(exhibition)
      .remove(client);
  }
}