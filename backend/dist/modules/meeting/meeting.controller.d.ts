import { MeetingService } from './meeting.service';
import { CreateMeetingDto, UpdateMeetingDto, FindMeetingsQueryDto } from './dto/meeting.dto';
import { Request } from 'express';
export declare class MeetingController {
    private readonly meetingService;
    constructor(meetingService: MeetingService);
    create(createMeetingDto: CreateMeetingDto, req: Request): Promise<import("./meeting.entity").Meeting>;
    findAll(query: FindMeetingsQueryDto, req: Request): Promise<{
        data: import("./meeting.entity").Meeting[];
        count: number;
    }>;
    findOne(id: string, req: Request): Promise<import("./meeting.entity").Meeting>;
    update(id: string, updateMeetingDto: UpdateMeetingDto, req: Request): Promise<import("./meeting.entity").Meeting>;
    remove(id: string, req: Request): Promise<void>;
    acceptMeeting(id: string, req: Request): Promise<import("./meeting.entity").Meeting>;
    declineMeeting(id: string, req: Request): Promise<import("./meeting.entity").Meeting>;
}
