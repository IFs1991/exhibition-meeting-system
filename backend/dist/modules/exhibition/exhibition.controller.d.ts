import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto, UpdateExhibitionDto } from './dto/exhibition.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
export declare class ExhibitionController {
    private readonly exhibitionService;
    constructor(exhibitionService: ExhibitionService);
    create(createExhibitionDto: CreateExhibitionDto): Promise<import("./entities/exhibition.entity").Exhibition>;
    findAll(query: PaginationQueryDto): Promise<{
        exhibitions: any;
        total: any;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./entities/exhibition.entity").Exhibition>;
    update(id: string, updateExhibitionDto: UpdateExhibitionDto): Promise<import("./entities/exhibition.entity").Exhibition>;
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
