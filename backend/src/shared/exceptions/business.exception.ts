import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * ビジネスロジックのエラー種別
 */
export enum BusinessErrorType {
  // 汎用エラー
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',

  // アプリケーション固有のエラー
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  INVALID_OPERATION = 'INVALID_OPERATION',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
}

/**
 * アプリケーション固有の業務エラーを表現する例外クラス
 */
export class BusinessException extends HttpException {
  /**
   * エラーの種別
   */
  readonly errorType: BusinessErrorType;

  /**
   * エラーの詳細情報
   */
  readonly details?: Record<string, any>;

  /**
   * エラーコード（文字列）
   */
  readonly code?: string;

  /**
   * コンストラクタ
   * @param errorType エラーの種別
   * @param message エラーメッセージ
   * @param details エラーの詳細情報（オプション）
   * @param status HTTPステータスコード（デフォルトはエラー種別から推測）
   * @param code エラーコード（オプション）
   */
  constructor(
    errorType: BusinessErrorType,
    message: string,
    details?: Record<string, any>,
    status?: HttpStatus,
    code?: string,
  ) {
    const statusCode = status || BusinessException.getStatusCodeFromErrorType(errorType);

    // レスポンスボディ
    const response = {
      statusCode,
      errorType,
      message,
      ...(details && { details }),
      ...(code && { code }),
      timestamp: new Date().toISOString(),
    };

    super(response, statusCode);

    this.errorType = errorType;
    this.details = details;
    this.code = code;
  }

  /**
   * エラー種別からHTTPステータスコードを取得
   * @param errorType エラーの種別
   * @returns 対応するHTTPステータスコード
   */
  private static getStatusCodeFromErrorType(errorType: BusinessErrorType): HttpStatus {
    switch (errorType) {
      case BusinessErrorType.VALIDATION_ERROR:
        return HttpStatus.BAD_REQUEST;
      case BusinessErrorType.UNAUTHORIZED:
      case BusinessErrorType.INVALID_CREDENTIALS:
      case BusinessErrorType.EXPIRED_TOKEN:
        return HttpStatus.UNAUTHORIZED;
      case BusinessErrorType.FORBIDDEN:
        return HttpStatus.FORBIDDEN;
      case BusinessErrorType.NOT_FOUND:
      case BusinessErrorType.RESOURCE_NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case BusinessErrorType.CONFLICT:
      case BusinessErrorType.RESOURCE_ALREADY_EXISTS:
        return HttpStatus.CONFLICT;
      case BusinessErrorType.DEPENDENCY_ERROR:
        return HttpStatus.FAILED_DEPENDENCY;
      case BusinessErrorType.INTERNAL_ERROR:
      case BusinessErrorType.INVALID_OPERATION:
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}