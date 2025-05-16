export declare class CreateExhibitionDto {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    isPublic?: boolean;
    additionalInfo?: string;
}
export declare class UpdateExhibitionDto {
    name?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    isPublic?: boolean;
    additionalInfo?: string;
}
export declare class ExhibitionDto {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    isPublic: boolean;
    additionalInfo?: string;
    createdAt: string;
    updatedAt: string;
}
