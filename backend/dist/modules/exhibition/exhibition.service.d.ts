import { CreateExhibitionDto, UpdateExhibitionDto } from './dto/exhibition.dto';
import { Repository } from 'typeorm';
import { Exhibition } from './entities/exhibition.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class ExhibitionService {
    private exhibitionRepository;
    private clientRepository;
    private meetingRepository;
    constructor(exhibitionRepository: Repository<Exhibition>, clientRepository: Repository<any>, meetingRepository: Repository<any>);
    create(createExhibitionDto: CreateExhibitionDto): Promise<Exhibition>;
    findAll(query: PaginationQueryDto): Promise<{
        exhibitions: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Exhibition>;
    update(id: string, updateExhibitionDto: UpdateExhibitionDto): Promise<Exhibition>;
    remove(id: string): Promise<void>;
    getRelatedClients(id: string, query: PaginationQueryDto): Promise<{
        clients: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    getScheduledMeetings(id: string, query: PaginationQueryDto): Promise<{
        meetings: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    addClient(exhibitionId: string, clientId: string, data: any): Promise<void>;
    removeClient(exhibitionId: string, clientId: string): Promise<void>;
}
