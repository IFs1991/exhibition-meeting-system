import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto, UpdateMeetingDto, FindMeetingsQueryDto } from './dto/meeting.dto';
import { AuthGuard } from '../user/guards/auth.guard'; // Assuming a general auth guard for authenticated users
import { Request } from 'express';

@UseGuards(AuthGuard) // Secure all routes, or apply more specific guards as needed
@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto, @Req() req: Request) {
    const userId = (req as any).user?.id;
    return this.meetingService.create(createMeetingDto, userId);
  }

  @Get()
  async findAll(@Query() query: FindMeetingsQueryDto, @Req() req: Request) {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role; // Assuming role is available on req.user
    return this.meetingService.findAll(query, userId, userRole);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role; // Assuming role is available on req.user
    return this.meetingService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto, @Req() req: Request) {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role; // Assuming role is available on req.user
    return this.meetingService.update(id, updateMeetingDto, userId, userRole);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role; // Assuming role is available on req.user
    return this.meetingService.remove(id, userId, userRole);
  }

  // Endpoint for a client to accept a meeting invitation
  @Patch(':id/accept')
  async acceptMeeting(@Param('id') id: string, @Req() req: Request) {
    const clientId = (req as any).user?.id; // Assuming the logged-in user is the client
    return this.meetingService.acceptMeeting(id, clientId);
  }

  // Endpoint for a client to decline a meeting invitation
  @Patch(':id/decline')
  async declineMeeting(@Param('id') id: string, @Req() req: Request) {
    const clientId = (req as any).user?.id; // Assuming the logged-in user is the client
    return this.meetingService.declineMeeting(id, clientId);
  }
}