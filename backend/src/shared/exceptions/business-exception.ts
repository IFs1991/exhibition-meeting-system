import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * ビジネスロジックの例外を表現するカスタム例外クラス
 */
export class BusinessException extends HttpException {
  /**
   * エラーコード (オプション)
   */
  private readonly errorCode?: string;

  /**
   * 詳細情報 (オプション)
   */
  private readonly details?: any;

  /**
   * BusinessExceptionコンストラクタ
   * @param message エラーメッセージ
   * @param status HTTPステータスコード (デフォルト: 400 Bad Request)
   * @param errorCode 業務エラーコード (オプション)
   * @param details エラーの詳細情報 (オプション)
   */
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode?: string,
    details?: any,
  ) {
    super(
      {
        message,
        error: 'Business Rule Violation',
        ...(errorCode && { errorCode }),
        ...(details && { details }),
      },
      status,
    );

    this.errorCode = errorCode;
    this.details = details;
  }

  /**
   * エラーコードを取得
   */
  getErrorCode(): string | undefined {
    return this.errorCode;
  }

  /**
   * 詳細情報を取得
   */
  getDetails(): any {
    return this.details;
  }
}

// 具体的なビジネス例外のファクトリメソッド
export const ResourceNotFoundException = (
  resource: string,
  id?: string | number,
): BusinessException => {
  const message = id
    ? `${resource} with ID ${id} not found`
    : `${resource} not found`;
  return new BusinessException(message, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND');
};

export const ValidationFailedException = (
  details: any,
): BusinessException => {
  return new BusinessException(
    'Validation failed',
    HttpStatus.BAD_REQUEST,
    'VALIDATION_FAILED',
    details,
  );
};

export const UnauthorizedException = (
  message = 'Unauthorized access',
): BusinessException => {
  return new BusinessException(
    message,
    HttpStatus.UNAUTHORIZED,
    'UNAUTHORIZED',
  );
};

export const ForbiddenException = (
  message = 'Access forbidden',
): BusinessException => {
  return new BusinessException(
    message,
    HttpStatus.FORBIDDEN,
    'FORBIDDEN',
  );
};