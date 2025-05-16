import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { Meeting } from './meeting.entity';
import { User } from '../user/entities/user.entity'; // Userエンティティのパスを確認・調整してください
import { Exhibition } from '../admin/exhibition/entities/exhibition.entity'; // Exhibitionエンティティのパスを確認・調整してください
// import { AuthModule } from '../auth/auth.module'; // 必要に応じてAuthModuleをインポート (例: ガードで使用する場合)

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting, User, Exhibition]), // Meetingエンティティと関連エンティティを登録
    // AuthModule, // AuthGuardなどをグローバルではなくモジュールレベルで提供する場合
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService], // 他のモジュールでMeetingServiceを利用する場合
})
export class MeetingModule {}