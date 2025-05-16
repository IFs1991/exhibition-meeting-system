import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../user/guards/auth.guard';
import { SuggestionRequestDto, MeetingPurposeRequestDto } from './dto/ai-request.dto';

// 簡易的なレート制限の実装
class RateLimiter {
  private requests: Map<string, { count: number, timestamp: number }> = new Map();
  private readonly limit: number = 10; // ユーザーあたりの最大リクエスト数
  private readonly timeWindow: number = 60 * 1000; // 時間枠（ミリ秒）- 1分

  check(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId);

    if (!userRequests) {
      this.requests.set(userId, { count: 1, timestamp: now });
      return true;
    }

    // タイムウィンドウをリセット
    if (now - userRequests.timestamp > this.timeWindow) {
      this.requests.set(userId, { count: 1, timestamp: now });
      return true;
    }

    // リクエスト回数チェック
    if (userRequests.count >= this.limit) {
      return false;
    }

    // カウント増加
    this.requests.set(userId, { count: userRequests.count + 1, timestamp: userRequests.timestamp });
    return true;
  }
}

const rateLimiter = new RateLimiter();

@ApiTags('ai')
@UseGuards(AuthGuard)
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest')
  @ApiOperation({ summary: 'AIによる提案生成' })
  @ApiResponse({ status: 200, description: 'AI生成結果を返却' })
  async generateSuggestion(@Body() request: SuggestionRequestDto) {
    // レート制限チェック
    const userId = 'user-id'; // 実際には認証情報からユーザーIDを取得
    if (!rateLimiter.check(userId)) {
      throw new HttpException('リクエスト回数制限を超えました。しばらく時間を置いてお試しください', HttpStatus.TOO_MANY_REQUESTS);
    }

    // プロンプトの最大長をチェック
    const maxPromptLength = 1000;
    if (request.prompt.length > maxPromptLength) {
      throw new HttpException(`プロンプトが長すぎます。${maxPromptLength}文字以内で入力してください`, HttpStatus.BAD_REQUEST);
    }

    const { prompt, context } = request;
    const result = await this.aiService.generateSuggestion(prompt, context);
    return { result };
  }

  @Post('meeting-purpose')
  @ApiOperation({ summary: '商談目的文の生成支援' })
  @ApiResponse({ status: 200, description: '商談目的文の候補を返却' })
  async generateMeetingPurpose(@Body() request: MeetingPurposeRequestDto) {
    // レート制限チェック
    const userId = 'user-id'; // 実際には認証情報からユーザーIDを取得
    if (!rateLimiter.check(userId)) {
      throw new HttpException('リクエスト回数制限を超えました。しばらく時間を置いてお試しください', HttpStatus.TOO_MANY_REQUESTS);
    }

    const { clientInfo, exhibitionInfo, keywords } = request;

    // キーワード数の制限
    if (keywords && keywords.length > 10) {
      throw new HttpException('キーワードは10個以内で指定してください', HttpStatus.BAD_REQUEST);
    }

    const suggestions = await this.aiService.generateMeetingPurpose(clientInfo, exhibitionInfo, keywords);
    return { suggestions };
  }
}