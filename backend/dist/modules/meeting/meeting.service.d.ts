import { Repository } from 'typeorm';
import { Meeting } from './meeting.entity';
import { CreateMeetingDto, UpdateMeetingDto, FindMeetingsQueryDto } from './dto/meeting.dto';
import { User } from '../user/entities/user.entity';
import { Exhibition } from '../admin/exhibition/entities/exhibition.entity';
export declare class MeetingService {
    private readonly meetingRepository;
    private readonly userRepository;
    private readonly exhibitionRepository;
    constructor(meetingRepository: Repository<Meeting>, userRepository: Repository<User>, exhibitionRepository: Repository<Exhibition>);
    create(createMeetingDto: CreateMeetingDto, organizerId: string): Promise<Meeting>;
    findAll(query: FindMeetingsQueryDto, userId: string, userRole: string): Promise<{
        data: Meeting[];
        count: number;
    }>;
    findOne(id: string, userId: string, userRole: string): Promise<Meeting>;
    update(id: string, updateMeetingDto: UpdateMeetingDto, userId: string, userRole: string): Promise<Meeting>;
    remove(id: string, userId: string, userRole: string): Promise<void>;
    acceptMeeting(meetingId: string, clientId: string): Promise<Meeting>;
    declineMeeting(meetingId: string, clientId: string): Promise<Meeting>;
}
