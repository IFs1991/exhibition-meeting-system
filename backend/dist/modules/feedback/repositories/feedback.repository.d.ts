import { Repository, DataSource } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { Feedback } from '../entities/feedback.entity';
export declare class FeedbackRepository {
    private readonly feedbackRepo;
    private readonly dataSource;
    private readonly dbConfig;
    constructor(feedbackRepo: Repository<Feedback>, dataSource: DataSource, dbConfig: DatabaseConfig);
    create(feedback: Partial<Feedback>): Promise<Feedback>;
    findById(id: string): Promise<Feedback>;
    update(id: string, feedback: Partial<Feedback>): Promise<Feedback>;
    delete(id: string): Promise<void>;
    getFeedbacksByReceiptId(receiptId: string): Promise<Feedback[]>;
    getApprovalRateStats(startDate: Date, endDate: Date): Promise<any>;
    getFeedbacksByCategory(categoryId: string, limit?: number): Promise<Feedback[]>;
    getRecentRejectionReasons(limit?: number): Promise<any>;
    getFeedbackTrends(days?: number): Promise<any>;
}
