import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { QueryFailedError } from 'typeorm';

/**
 * グローバル例外フィルター
 * アプリケーション全体での未処理の例外をキャッチし、一貫したエラーレスポンスを返す
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: Record<string, any> = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    };

    // BusinessException の処理（専用の処理）
    if (exception instanceof BusinessException) {
      // すでにフォーマットされたレスポンスが含まれている
      const exceptionResponse = exception.getResponse() as Record<string, any>;
      status = exception.getStatus();
      errorResponse = {
        ...exceptionResponse,
        path: request.url
      };
    }
    // 標準的な HttpException の処理
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        errorResponse = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: (exceptionResponse as any).error || exception.name,
          message: (exceptionResponse as any).message || 'An error occurred',
          ...(Array.isArray((exceptionResponse as any).message) && {
            details: (exceptionResponse as any).message
          })
        };
      } else {
        errorResponse = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: exception.name,
          message: exceptionResponse as string
        };
      }
    }
    // TypeORMのQueryFailedErrorの処理（DB関連のエラー）
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;

      // PostgreSQLの一意制約違反エラー
      if ((exception as any).code === '23505') {
        status = HttpStatus.CONFLICT;
        errorResponse = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: 'Resource Conflict',
          message: 'A resource with the same unique identifier already exists',
          code: (exception as any).code
        };
      } else {
        errorResponse = {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: 'Database Error',
          message: exception.message,
          code: (exception as any).code
        };
      }
    }
    // その他の一般的なエラー
    else if (exception instanceof Error) {
      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: exception.name,
        message: exception.message
      };
    }

    // エラーログの記録（開発環境ではスタックトレースも含む）
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      this.logger.error(
        `${request.method} ${request.url} - ${exception.message}`,
        exception.stack
      );

      // 開発環境の場合はスタックトレースも含める
      errorResponse.stack = exception.stack;
    } else {
      this.logger.error(
        `${request.method} ${request.url} - Status: ${status} - Error: ${errorResponse.error} - Message: ${errorResponse.message}`
      );
    }

    // レスポンスの送信
    response.status(status).json(errorResponse);
  }
}