import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exhibition } from '../entities/exhibition.entity'; // Assuming entity path
import { CreateExhibitionDto, UpdateExhibitionDto } from '../dto/exhibition.dto'; // Assuming DTO path

@Injectable()
export class ExhibitionService {
  constructor(
    @InjectRepository(Exhibition)
    private readonly exhibitionRepository: Repository<Exhibition>,
  ) {}

  async create(createExhibitionDto: CreateExhibitionDto): Promise<Exhibition> {
    const exhibition = this.exhibitionRepository.create(createExhibitionDto);
    return this.exhibitionRepository.save(exhibition);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Exhibition[], count: number }> {
    const [data, count] = await this.exhibitionRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { startDate: 'DESC' } // Optional: order by start date or other relevant field
    });
    return { data, count };
  }

  async findOne(id: string): Promise<Exhibition> {
    const exhibition = await this.exhibitionRepository.findOne({ where: { id } });
    if (!exhibition) {
      throw new NotFoundException(`Exhibition with ID "${id}" not found`);
    }
    return exhibition;
  }

  async update(id: string, updateExhibitionDto: UpdateExhibitionDto): Promise<Exhibition> {
    const exhibition = await this.findOne(id); // Reuse findOne to ensure exhibition exists
    this.exhibitionRepository.merge(exhibition, updateExhibitionDto);
    return this.exhibitionRepository.save(exhibition);
  }

  async remove(id: string): Promise<void> {
    const exhibition = await this.findOne(id); // Reuse findOne to ensure exhibition exists
    await this.exhibitionRepository.remove(exhibition);
    // Or, for soft delete if implemented in entity:
    // exhibition.deletedAt = new Date();
    // await this.exhibitionRepository.save(exhibition);
  }
}