import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
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
