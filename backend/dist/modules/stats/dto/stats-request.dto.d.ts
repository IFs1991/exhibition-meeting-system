export declare class StatsRequestDto {
    startDate?: string;
    endDate?: string;
    filter?: string;
    groupBy?: string;
}
export declare class TimeSeriesRequestDto {
    startDate: string;
    endDate: string;
    metric: string;
    groupBy?: string;
}
