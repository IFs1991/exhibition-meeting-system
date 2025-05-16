import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): { message: string } {
    return { message: '展示会商談管理システム APIサーバー' };
  }
}