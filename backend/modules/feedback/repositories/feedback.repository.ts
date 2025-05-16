import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { Feedback } from '../entities/feedback.entity';
import { Receipt } from '../../receipt/entities/receipt.entity';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
    private readonly dataSource: DataSource,
    private readonly dbConfig: DatabaseConfig
  ) {}

  async create(feedback: Partial<Feedback>): Promise<Feedback> {
    const newFeedback = this.feedbackRepo.create(feedback);
    return await this.feedbackRepo.save(newFeedback);
  }

  async findById(id: string): Promise<Feedback> {
    return await this.feedbackRepo.findOne({
      where: { id },
      relations: ['receipt']
    });
  }

  async update(id: string, feedback: Partial<Feedback>): Promise<Feedback> {
    await this.feedbackRepo.update(id, feedback);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.feedbackRepo.delete(id);
  }

  async getFeedbacksByReceiptId(receiptId: string): Promise<Feedback[]> {
    return await this.feedbackRepo.find({
      where: { receipt: { id: receiptId } },
      order: { createdAt: 'DESC' }
    });
  }

  async getApprovalRateStats(startDate: Date, endDate: Date) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      const stats = await queryRunner.query(`
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as total,
          COUNT(CASE WHEN is_approved = true THEN 1 END) as approved,
          ROUND(COUNT(CASE WHEN is_approved = true THEN 1 END)::numeric / COUNT(*)::numeric * 100, 2) as approval_rate
        FROM feedback
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month ASC
      `, [startDate, endDate]);
      
      return stats;
    } finally {
      await queryRunner.release();
    }
  }

  async getFeedbacksByCategory(categoryId: string, limit: number = 10): Promise<Feedback[]> {
    return await this.feedbackRepo
      .createQueryBuilder('feedback')
      .innerJoinAndSelect('feedback.receipt', 'receipt')
      .where('receipt.categoryId = :categoryId', { categoryId })
      .orderBy('feedback.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async getRecentRejectionReasons(limit: number = 5) {
    return await this.feedbackRepo
      .createQueryBuilder('feedback')
      .select('rejection_reason')
      .addSelect('COUNT(*)', 'count')
      .where('is_approved = false')
      .andWhere('rejection_reason IS NOT NULL')
      .groupBy('rejection_reason')
      .orderBy('count', 'DESC')
      .take(limit)
      .getRawMany();
  }

  async getFeedbackTrends(days: number = 30) {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      return await queryRunner.query(`
        WITH RECURSIVE dates AS (
          SELECT DATE_TRUNC('day', NOW()) as date
          UNION ALL
          SELECT date - INTERVAL '1 day'
          FROM dates
          WHERE date > DATE_TRUNC('day', NOW()) - INTERVAL '${days} days'
        )
        SELECT 
          d.date,
          COUNT(f.id) as feedback_count,
          COUNT(CASE WHEN f.is_approved THEN 1 END) as approved_count
        FROM dates d
        LEFT JOIN feedback f ON DATE_TRUNC('day', f.created_at) = d.date
        GROUP BY d.date
        ORDER BY d.date ASC
      `);
    } finally {
      await queryRunner.release();
    }
  }
}