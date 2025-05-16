import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDto } from './dto/client.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    create(createClientDto: CreateClientDto): Promise<ClientDto>;
    findAll(): Promise<ClientDto[]>;
    findOne(id: string): Promise<ClientDto>;
    update(id: string, updateClientDto: UpdateClientDto): Promise<ClientDto>;
    remove(id: string): Promise<void>;
    private mapToDto;
}
