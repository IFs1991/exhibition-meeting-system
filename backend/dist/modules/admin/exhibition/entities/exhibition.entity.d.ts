import { Meeting } from '../../../meeting/meeting.entity';
export declare class Exhibition {
    id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
    meetings: Meeting[];
}
