import { DataSource, Repository } from 'typeorm';
import { Client } from '../entities/client.entity';
export declare class ClientRepository extends Repository<Client> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByEmail(email: string): Promise<Client | undefined>;
}
