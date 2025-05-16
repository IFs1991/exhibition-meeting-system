export declare enum MeetingStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    CANCELED = "CANCELED",
    COMPLETED = "COMPLETED"
}
export declare class CreateMeetingDto {
    exhibitionId: string;
    clientId: string;
    startTime: Date;
    endTime: Date;
    title?: string;
    description?: string;
}
export declare class UpdateMeetingDto {
    startTime?: Date;
    endTime?: Date;
    title?: string;
    description?: string;
    status?: MeetingStatus;
}
export declare class FindMeetingsQueryDto {
    exhibitionId?: string;
    organizerId?: string;
    clientId?: string;
    status?: MeetingStatus;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
