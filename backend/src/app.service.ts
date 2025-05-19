import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '展示会商談管理システム APIサーバー';
  }
}