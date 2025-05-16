import { Client } from '../../client/entities/client.entity';
export declare class Exhibition {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    isPublic: boolean;
    additionalInfo?: string;
    clients: Client[];
    createdAt: Date;
    updatedAt: Date;
}
