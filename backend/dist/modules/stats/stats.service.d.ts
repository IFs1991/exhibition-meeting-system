import { StatsRepository } from '../repositories/stats.repository';
import { ReceiptService } from '../../receipt/receipt.service';
import { FeedbackService } from '../../feedback/feedback.service';
import { DateRange, AnalysisFilter, GroupByOption } from '../dto/stats-request.dto';
declare class StatsRepository {
}
export declare class StatsService {
    private readonly statsRepository;
    private readonly receiptService;
    private readonly feedbackService;
    constructor(statsRepository: StatsRepository, receiptService: ReceiptService, feedbackService: FeedbackService);
    getApprovalStats(dateRange: DateRange): Promise<{
        totalCount: any;
        approvedCount: any;
        rejectedCount: any;
        approvalRate: number;
    }>;
    getBodyPartAnalysis(filter: AnalysisFilter): Promise<any>;
    getSymptomAnalysis(filter: AnalysisFilter): Promise<{
        symptoms: any;
        patterns: any;
    }>;
    getTimeSeriesAnalysis(dateRange: DateRange, groupBy: GroupByOption): Promise<{
        timeSeries: any;
        trends: {
            movingAverage: {
                date: any;
                value: number;
            }[];
            seasonality: {
                weekly: number[];
                monthly: number[];
            };
            trend: {
                date: any;
                value: number;
            }[];
        };
    }>;
    generateReport(filter: AnalysisFilter): Promise<{
        summary: {
            approvalStats: any;
            topBodyParts: any;
            topSymptoms: any;
        };
        details: {
            bodyPartAnalysis: any;
            symptomAnalysis: any;
            timeSeriesAnalysis: any;
        };
        insights: {
            feedback: any;
            recommendations: any[];
        };
    }>;
    private analyzeSymptomPatterns;
    private calculateTrends;
    private calculateMovingAverage;
    private detectSeasonality;
    private calculateTrendLine;
    private linearRegression;
    private generateRecommendations;
    private aggregateByDayOfWeek;
    private aggregateByMonthOfYear;
    getStats(query: any): Promise<{
        industryStats: {
            name: string;
            value: number;
            color: string;
        }[];
        dailyStats: {
            date: string;
            count: number;
        }[];
        clientStats: {
            name: string;
            count: number;
        }[];
        statusStats: {
            name: string;
            value: number;
            color: string;
        }[];
        timeSlotStats: {
            time: string;
            count: number;
        }[];
        summary: {
            totalMeetings: number;
            confirmationRate: number;
            cancellationRate: number;
        };
    }>;
    getTimeSeriesData(query: {
        startDate: string;
        endDate: string;
        metric: string;
        groupBy?: string;
    }): Promise<{
        labels: any[];
        data: any[];
        metric: string;
    }>;
    getExhibitionStats(exhibitionId: string): Promise<any>;
}
export {};
