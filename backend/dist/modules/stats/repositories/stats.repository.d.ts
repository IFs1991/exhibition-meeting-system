import { Repository } from 'typeorm';
import { DatabaseConfig } from '../../config/database-config';
import { Receipt } from '../receipt/entities/receipt.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
export declare class StatsRepository {
    private receiptRepository;
    private feedbackRepository;
    private dbConfig;
    constructor(receiptRepository: Repository<Receipt>, feedbackRepository: Repository<Feedback>, dbConfig: DatabaseConfig);
    getApprovalRateByPeriod(startDate: Date, endDate: Date): Promise<{
        approvalRate: number;
        total: any;
        approved: any;
    }>;
    getStatsByBodyPart(): Promise<any>;
    getMonthlyTrends(year: number): Promise<any>;
    getTopSymptomPatterns(): Promise<any>;
    getAverageProcessingTime(): Promise<any>;
    getUserPerformanceStats(userId: string): Promise<any>;
}
