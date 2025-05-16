import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, MoreThanOrEqual, LessThanOrEqual, ILike } from 'typeorm';
import { Meeting } from './meeting.entity';
import { CreateMeetingDto, UpdateMeetingDto, FindMeetingsQueryDto, MeetingStatus } from './dto/meeting.dto';
import { User } from '../user/entities/user.entity'; // Assuming User entity for organizer and client
import { Exhibition } from '../admin/exhibition/entities/exhibition.entity'; // Assuming Exhibition entity

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) // Meetingエンティティのリポジトリを注入
    private readonly meetingRepository: Repository<Meeting>,
    @InjectRepository(User) // Userエンティティのリポジトリを注入（主催者とクライアントの存在確認のため）
    private readonly userRepository: Repository<User>,
    @InjectRepository(Exhibition) // Exhibitionエンティティのリポジトリを注入（展示会の存在確認のため）
    private readonly exhibitionRepository: Repository<Exhibition>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto, organizerId: string): Promise<Meeting> {
    const { exhibitionId, clientId, startTime, endTime } = createMeetingDto;

    // 存在チェック
    const exhibition = await this.exhibitionRepository.findOneBy({ id: exhibitionId });
    if (!exhibition) {
      throw new NotFoundException(`ID "${exhibitionId}" の展示会が見つかりません。`);
    }

    const organizer = await this.userRepository.findOneBy({ id: organizerId });
    if (!organizer) {
      throw new NotFoundException(`ID "${organizerId}" の主催者が見つかりません。`);
    }
    // TODO: 主催者が展示会の出展者であるかどうかの検証ロジックを追加する可能性あり

    const client = await this.userRepository.findOneBy({ id: clientId });
    if (!client) {
      throw new NotFoundException(`ID "${clientId}" のクライアントが見つかりません。`);
    }

    // 開始日時と終了日時の検証
    if (new Date(startTime) >= new Date(endTime)) {
      throw new BadRequestException('開始日時は終了日時より前である必要があります。');
    }

    // TODO: 同じ時間帯に既存の商談がないかチェックするロジック (主催者とクライアント双方に対して)

    const meeting = this.meetingRepository.create({
      ...createMeetingDto,
      organizerId,
      status: MeetingStatus.PENDING, // 初期ステータスはPENDING
    });
    return this.meetingRepository.save(meeting);
  }

  async findAll(query: FindMeetingsQueryDto, userId: string, userRole: string): Promise<{ data: Meeting[], count: number }> {
    const { page = 1, limit = 10, exhibitionId, organizerId, clientId, status, dateFrom, dateTo, sortBy = 'startTime', sortOrder = 'ASC' } = query;
    const skip = (page - 1) * limit;

    const options: FindManyOptions<Meeting> = {
      where: {},
      relations: ['exhibition', 'organizer', 'client'], // 関連エンティティをロード
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
    };

    if (exhibitionId) {
      options.where = { ...options.where, exhibitionId };
    }
    if (status) {
      options.where = { ...options.where, status };
    }
    if (dateFrom) {
      options.where = { ...options.where, startTime: MoreThanOrEqual(new Date(dateFrom)) };
    }
    if (dateTo) {
      options.where = { ...options.where, endTime: LessThanOrEqual(new Date(dateTo)) };
    }

    // ユーザーロールに基づいてフィルタリング
    if (userRole === 'admin') {
      // 管理者は全ての商談を閲覧可能 (オプションでorganizerIdやclientIdでフィルタリング)
      if (organizerId) {
        options.where = { ...options.where, organizerId };
      }
      if (clientId) {
        options.where = { ...options.where, clientId };
      }
    } else if (userRole === 'exhibitor') {
      // 出展者は自身が主催する商談のみ閲覧可能
      options.where = { ...options.where, organizerId: userId };
      if (clientId) { // 出展者が特定のクライアントとの商談を検索する場合
        options.where = { ...options.where, clientId };
      }
    } else if (userRole === 'client') {
      // クライアントは自身が招待された商談のみ閲覧可能
      options.where = { ...options.where, clientId: userId };
      if (organizerId) { // クライアントが特定の主催者との商談を検索する場合
         options.where = { ...options.where, organizerId };
      }
    } else {
        // その他のロールや未認証ユーザーは空の結果を返すか、エラーを投げる
        return { data: [], count: 0 };
    }

    const [data, count] = await this.meetingRepository.findAndCount(options);
    return { data, count };
  }

  async findOne(id: string, userId: string, userRole: string): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['exhibition', 'organizer', 'client'],
    });

    if (!meeting) {
      throw new NotFoundException(`ID "${id}" の商談が見つかりません。`);
    }

    // 権限チェック
    if (userRole !== 'admin' && meeting.organizerId !== userId && meeting.clientId !== userId) {
      throw new ForbiddenException('この商談にアクセスする権限がありません。');
    }

    return meeting;
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto, userId: string, userRole: string): Promise<Meeting> {
    const meeting = await this.findOne(id, userId, userRole); // findOneで権限チェックも行う

    // 主催者のみが一部の情報を更新可能、または管理者
    if (userRole !== 'admin' && meeting.organizerId !== userId) {
        // クライアントはステータス変更(accept/decline)のみ許可されるべきだが、それは専用エンドポイントで行う
        // ここでは主催者以外の更新を制限
        if (updateMeetingDto.status && (updateMeetingDto.status === MeetingStatus.ACCEPTED || updateMeetingDto.status === MeetingStatus.DECLINED)) {
            // ステータス変更は専用メソッドへ
            throw new ForbiddenException('ステータスの更新は承諾または辞退のエンドポイントを使用してください。');
        }
        if (Object.keys(updateMeetingDto).some(key => key !== 'status')) {
             throw new ForbiddenException('商談の主催者または管理者のみがこの情報を更新できます。');
        }
    }

    // 開始日時と終了日時の検証 (提供されている場合)
    const startTime = updateMeetingDto.startTime ? new Date(updateMeetingDto.startTime) : new Date(meeting.startTime);
    const endTime = updateMeetingDto.endTime ? new Date(updateMeetingDto.endTime) : new Date(meeting.endTime);
    if (startTime >= endTime) {
      throw new BadRequestException('開始日時は終了日時より前である必要があります。');
    }

    // TODO: 更新時にも時間帯の重複チェックを行う

    // PENDING 以外のステータスで主催者が更新しようとした場合の制限 (例: ACCEPTED後は変更不可など)
    if (meeting.status !== MeetingStatus.PENDING && meeting.organizerId === userId && userRole !== 'admin') {
        if (updateMeetingDto.startTime || updateMeetingDto.endTime || updateMeetingDto.title || updateMeetingDto.description) {
            throw new ForbiddenException(`ステータスが "${meeting.status}" のため、基本情報の変更はできません。`);
        }
    }

    // 管理者はステータスも更新可能
    if (userRole === 'admin' && updateMeetingDto.status) {
        meeting.status = updateMeetingDto.status;
    }

    // DTOの他のプロパティをマージ
    Object.assign(meeting, {
        ...updateMeetingDto,
        startTime: updateMeetingDto.startTime || meeting.startTime,
        endTime: updateMeetingDto.endTime || meeting.endTime,
    });

    return this.meetingRepository.save(meeting);
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const meeting = await this.findOne(id, userId, userRole); // findOneで権限チェック

    // 主催者または管理者のみ削除可能
    if (userRole !== 'admin' && meeting.organizerId !== userId) {
      throw new ForbiddenException('商談の主催者または管理者のみがこの商談を削除できます。');
    }

    // 物理削除ではなく、ステータスをCANCELEDにするか、ソフトデリートを検討
    // ここでは物理削除の例
    const result = await this.meetingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID "${id}" の商談が見つかりません。`);
    }
  }

  async acceptMeeting(meetingId: string, clientId: string): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOneBy({ id: meetingId });
    if (!meeting) {
      throw new NotFoundException(`ID "${meetingId}" の商談が見つかりません。`);
    }
    if (meeting.clientId !== clientId) {
      throw new ForbiddenException('この商談を承諾する権限がありません。招待されたクライアントのみが承諾できます。');
    }
    if (meeting.status !== MeetingStatus.PENDING) {
      throw new BadRequestException(`この商談は既に "${meeting.status}" の状態のため、承諾できません。`);
    }
    meeting.status = MeetingStatus.ACCEPTED;
    return this.meetingRepository.save(meeting);
  }

  async declineMeeting(meetingId: string, clientId: string): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOneBy({ id: meetingId });
    if (!meeting) {
      throw new NotFoundException(`ID "${meetingId}" の商談が見つかりません。`);
    }
    if (meeting.clientId !== clientId) {
      throw new ForbiddenException('この商談を辞退する権限がありません。招待されたクライアントのみが辞退できます。');
    }
    if (meeting.status !== MeetingStatus.PENDING && meeting.status !== MeetingStatus.ACCEPTED) {
        // ACCEPTED後でも辞退(キャンセル)できる仕様とするか検討。ここではPENDINGのみ辞退可能とする。
      throw new BadRequestException(`この商談は "${meeting.status}" の状態のため、辞退できません。`);
    }
    meeting.status = MeetingStatus.DECLINED;
    return this.meetingRepository.save(meeting);
  }

  // TODO: 必要に応じて、ユーザーが特定の時間帯に空いているかを確認するヘルパーメソッドなどを追加
}