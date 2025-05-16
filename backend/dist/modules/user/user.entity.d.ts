import { Meeting } from '../meeting/meeting.entity';
export declare enum UserRole {
    ADMIN = "admin",
    EXHIBITOR = "exhibitor",
    CLIENT = "client",
    USER = "user"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    clinicName: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    organizedMeetings: Meeting[];
    invitedMeetings: Meeting[];
}
