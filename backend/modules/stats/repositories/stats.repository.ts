import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Raw } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { Receipt } from '../receipt/entities/receipt.entity';
import { Feedback } from '../feedback/entities/feedback.entity';

@Injectable()
export class StatsRepository {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private dbConfig: DatabaseConfig
  ) {}

  async getApprovalRateByPeriod(startDate: Date, endDate: Date) {
    const result = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select([
        'COUNT(*) as total',
        'SUM(CASE WHEN feedback.isApproved = true THEN 1 ELSE 0 END) as approved'
      ])
      .where('feedback.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate
      })
      .getRawOne();

    return {
      approvalRate: result.total > 0 ? (result.approved / result.total) * 100 : 0,
      total: result.total,
      approved: result.approved
    };
  }

  async getStatsByBodyPart() {
    return await this.receiptRepository
      .createQueryBuilder('receipt')
      .select([
        'receipt.bodyPart',
        'COUNT(*) as count',
        'AVG(CASE WHEN feedback.isApproved = true THEN 1 ELSE 0 END) * 100 as approvalRate'
      ])
      .leftJoin('receipt.feedback', 'feedback')
      .groupBy('receipt.bodyPart')
      .orderBy('count', 'DESC')
      .cache(this.dbConfig.queryCacheDuration)
      .getRawMany();
  }

  async getMonthlyTrends(year: number) {
    return await this.receiptRepository
      .createQueryBuilder('receipt')
      .select([
        'EXTRACT(MONTH FROM receipt.createdAt) as month',
        'COUNT(*) as totalCases',
        'AVG(CASE WHEN feedback.isApproved = true THEN 1 ELSE 0 END) * 100 as approvalRate'
      ])
      .leftJoin('receipt.feedback', 'feedback')
      .where('EXTRACT(YEAR FROM receipt.createdAt) = :year', { year })
      .groupBy('month')
      .orderBy('month')
      .cache(this.dbConfig.queryCacheDuration)
      .getRawMany();
  }

  async getTopSymptomPatterns() {
    return await this.receiptRepository
      .createQueryBuilder('receipt')
      .select([
        'receipt.symptoms',
        'COUNT(*) as frequency',
        'AVG(CASE WHEN feedback.isApproved = true THEN 1 ELSE 0 END) * 100 as successRate'
      ])
      .leftJoin('receipt.feedback', 'feedback')
      .groupBy('receipt.symptoms')
      .having('COUNT(*) >= :minCount', { minCount: 5 })
      .orderBy('frequency', 'DESC')
      .limit(10)
      .cache(this.dbConfig.queryCacheDuration)
      .getRawMany();
  }

  async getAverageProcessingTime() {
    return await this.receiptRepository
      .createQueryBuilder('receipt')
      .select([
        'AVG(EXTRACT(EPOCH FROM (feedback.createdAt - receipt.createdAt))) as avgProcessingTime'
      ])
      .leftJoin('receipt.feedback', 'feedback')
      .where('feedback.id IS NOT NULL')
      .getRawOne();
  }

  async getUserPerformanceStats(userId: string) {
    return await this.receiptRepository
      .createQueryBuilder('receipt')
      .select([
        'COUNT(*) as totalSubmissions',
        'AVG(CASE WHEN feedback.isApproved = true THEN 1 ELSE 0 END) * 100 as approvalRate',
        'AVG(EXTRACT(EPOCH FROM (feedback.createdAt - receipt.createdAt))) as avgProcessingTime'
      ])
      .leftJoin('receipt.feedback', 'feedback')
      .where('receipt.userId = :userId', { userId })
      .getRawOne();
  }
}