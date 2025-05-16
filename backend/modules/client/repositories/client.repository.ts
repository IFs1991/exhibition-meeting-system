import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientRepository extends Repository<Client> {
  constructor(private dataSource: DataSource) {
    super(Client, dataSource.createEntityManager());
  }

  // カスタムリポジトリメソッドをここに追加できます
  // 例: メールアドレスでクライアントを検索するメソッド
  async findByEmail(email: string): Promise<Client | undefined> {
    return this.findOne({ where: { email } });
  }
}