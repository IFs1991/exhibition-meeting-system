import { Repository } from 'typeorm';
import { Exhibition } from '../entities/exhibition.entity';
import { CreateExhibitionDto, UpdateExhibitionDto } from '../dto/exhibition.dto';
export declare class ExhibitionService {
    private readonly exhibitionRepository;
    constructor(exhibitionRepository: Repository<Exhibition>);
    create(createExhibitionDto: CreateExhibitionDto): Promise<Exhibition>;
    findAll(page?: number, limit?: number): Promise<{
        data: Exhibition[];
        count: number;
    }>;
    findOne(id: string): Promise<Exhibition>;
    update(id: string, updateExhibitionDto: UpdateExhibitionDto): Promise<Exhibition>;
    remove(id: string): Promise<void>;
}
