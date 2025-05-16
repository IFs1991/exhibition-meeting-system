import { ExhibitionService } from './exhibition.service';
import { CreateExhibitionDto, UpdateExhibitionDto } from '../dto/exhibition.dto';
export declare class ExhibitionController {
    private readonly exhibitionService;
    constructor(exhibitionService: ExhibitionService);
    create(createExhibitionDto: CreateExhibitionDto): Promise<import("../entities/exhibition.entity").Exhibition>;
    findAll(page: string, limit: string): Promise<{
        data: import("../entities/exhibition.entity").Exhibition[];
        count: number;
    }>;
    findOne(id: string): Promise<import("../entities/exhibition.entity").Exhibition>;
    update(id: string, updateExhibitionDto: UpdateExhibitionDto): Promise<import("../entities/exhibition.entity").Exhibition>;
    remove(id: string): Promise<void>;
}
