export declare class CreateClientDto {
    name: string;
    contactPerson?: string;
    email: string;
    phoneNumber?: string;
}
export declare class UpdateClientDto {
    name?: string;
    contactPerson?: string;
    email?: string;
    phoneNumber?: string;
}
export declare class ClientDto {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
}
