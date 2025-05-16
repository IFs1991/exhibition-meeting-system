import { User } from '../user/user.entity';
import { Exhibition } from '../admin/exhibition/entities/exhibition.entity';
import { MeetingStatus } from './dto/meeting.dto';
export declare class Meeting {
    id: string;
    exhibitionId: string;
    exhibition: Exhibition;
    organizerId: string;
    organizer: User;
    clientId: string;
    client: User;
    startTime: Date;
    endTime: Date;
    title?: string;
    description?: string;
    status: MeetingStatus;
    createdAt: Date;
    updatedAt: Date;
    meetingLink?: string;
    internalNotes?: string;
}
