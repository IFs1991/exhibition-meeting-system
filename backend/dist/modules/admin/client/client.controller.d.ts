import { ClientService } from './client.service';
import { CreateClientDto, UpdateClientDto } from '../dto/client.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    create(createClientDto: CreateClientDto): Promise<import("../entities/client.entity").Client>;
    findAll(page: string, limit: string): Promise<{
        data: import("../entities/client.entity").Client[];
        count: number;
    }>;
    findOne(id: string): Promise<import("../entities/client.entity").Client>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<import("../entities/client.entity").Client>;
    remove(id: string): Promise<void>;
}
