"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const stats_repository_1 = require("../repositories/stats.repository");
const receipt_service_1 = require("../../receipt/receipt.service");
const feedback_service_1 = require("../../feedback/feedback.service");
class StatsRepository {
}
let StatsService = class StatsService {
    constructor(statsRepository, receiptService, feedbackService) {
        this.statsRepository = statsRepository;
        this.receiptService = receiptService;
        this.feedbackService = feedbackService;
    }
    async getApprovalStats(dateRange) {
        const approvalData = await this.statsRepository.getApprovalRates(dateRange);
        return {
            totalCount: approvalData.total,
            approvedCount: approvalData.approved,
            rejectedCount: approvalData.rejected,
            approvalRate: (approvalData.approved / approvalData.total) * 100,
        };
    }
    async getBodyPartAnalysis(filter) {
        const bodyPartStats = await this.statsRepository.getBodyPartStats(filter);
        const enrichedStats = await Promise.all(bodyPartStats.map(async (stat) => {
            const approvalRate = await this.statsRepository.getApprovalRateByBodyPart(stat.bodyPart, filter.dateRange);
            return {
                ...stat,
                approvalRate,
            };
        }));
        return enrichedStats;
    }
    async getSymptomAnalysis(filter) {
        const symptomStats = await this.statsRepository.getSymptomStats(filter);
        const commonPatterns = await this.analyzeSymptomPatterns(symptomStats);
        return {
            symptoms: symptomStats,
            patterns: commonPatterns,
        };
    }
    async getTimeSeriesAnalysis(dateRange, groupBy) {
        const timeSeriesData = await this.statsRepository.getTimeSeriesStats(dateRange, groupBy);
        const trends = this.calculateTrends(timeSeriesData);
        return {
            timeSeries: timeSeriesData,
            trends,
        };
    }
    async generateReport(filter) {
        const [approvalStats, bodyPartStats, symptomStats, timeSeriesStats] = await Promise.all([
            this.getApprovalStats(filter.dateRange),
            this.getBodyPartAnalysis(filter),
            this.getSymptomAnalysis(filter),
            this.getTimeSeriesAnalysis(filter.dateRange, filter.groupBy),
        ]);
        const feedbackInsights = await this.feedbackService.getAggregatedFeedback(filter.dateRange);
        const recommendations = await this.generateRecommendations({
            approvalStats,
            bodyPartStats,
            symptomStats,
            feedbackInsights,
        });
        return {
            summary: {
                approvalStats,
                topBodyParts: bodyPartStats.slice(0, 5),
                topSymptoms: symptomStats.symptoms.slice(0, 5),
            },
            details: {
                bodyPartAnalysis: bodyPartStats,
                symptomAnalysis: symptomStats,
                timeSeriesAnalysis: timeSeriesStats,
            },
            insights: {
                feedback: feedbackInsights,
                recommendations,
            },
        };
    }
    analyzeSymptomPatterns(symptomStats) {
        const patterns = symptomStats.reduce((acc, curr) => {
            const coOccurrences = curr.relatedSymptoms.map((related) => ({
                pair: [curr.symptom, related.symptom],
                count: related.count,
            }));
            return [...acc, ...coOccurrences];
        }, []);
        return patterns.sort((a, b) => b.count - a.count).slice(0, 10);
    }
    calculateTrends(timeSeriesData) {
        const movingAverage = this.calculateMovingAverage(timeSeriesData, 7);
        const seasonality = this.detectSeasonality(timeSeriesData);
        const trend = this.calculateTrendLine(timeSeriesData);
        return {
            movingAverage,
            seasonality,
            trend,
        };
    }
    calculateMovingAverage(data, window) {
        return data.map((_, index) => {
            if (index < window - 1)
                return null;
            const slice = data.slice(index - window + 1, index + 1);
            const sum = slice.reduce((acc, curr) => acc + curr.value, 0);
            return {
                date: data[index].date,
                value: sum / window,
            };
        }).filter(Boolean);
    }
    detectSeasonality(data) {
        const weeklyPattern = this.aggregateByDayOfWeek(data);
        const monthlyPattern = this.aggregateByMonthOfYear(data);
        return {
            weekly: weeklyPattern,
            monthly: monthlyPattern,
        };
    }
    calculateTrendLine(data) {
        const xValues = data.map((_, i) => i);
        const yValues = data.map((d) => d.value);
        const { slope, intercept } = this.linearRegression(xValues, yValues);
        return data.map((d, i) => ({
            date: d.date,
            value: slope * i + intercept,
        }));
    }
    linearRegression(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
        const sumXX = x.reduce((a, b) => a + b * b, 0);
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        return { slope, intercept };
    }
    async generateRecommendations(data) {
        const recommendations = [];
        if (data.approvalStats.approvalRate < 80) {
            recommendations.push({
                type: 'approval',
                message: '承認率が低下傾向にあります。特に注意が必要な傷病部位と症状を確認してください。',
                priority: 'high',
            });
        }
        const lowApprovalBodyParts = data.bodyPartStats
            .filter((stat) => stat.approvalRate < 70)
            .map((stat) => ({
            type: 'bodyPart',
            message: `${stat.bodyPart}の承認率が${stat.approvalRate.toFixed(1)}%と低めです。記載内容を見直してください。`,
            priority: 'medium',
        }));
        recommendations.push(...lowApprovalBodyParts);
        return recommendations;
    }
    aggregateByDayOfWeek(data) {
        const weekdays = Array(7).fill(0).map(() => ({ count: 0, sum: 0 }));
        data.forEach((d) => {
            const day = new Date(d.date).getDay();
            weekdays[day].count++;
            weekdays[day].sum += d.value;
        });
        return weekdays.map((w) => w.sum / w.count);
    }
    aggregateByMonthOfYear(data) {
        const months = Array(12).fill(0).map(() => ({ count: 0, sum: 0 }));
        data.forEach((d) => {
            const month = new Date(d.date).getMonth();
            months[month].count++;
            months[month].sum += d.value;
        });
        return months.map((m) => m.sum / m.count);
    }
    async getStats(query) {
        const industryStats = [
            { name: "IT・通信", value: 35, color: "#8884d8" },
            { name: "製造", value: 25, color: "#83a6ed" },
            { name: "商社", value: 18, color: "#8dd1e1" },
            { name: "金融・保険", value: 15, color: "#82ca9d" },
            { name: "建設・不動産", value: 12, color: "#a4de6c" },
            { name: "医療・ヘルスケア", value: 10, color: "#d0ed57" },
            { name: "その他", value: 27, color: "#ffc658" },
        ];
        const dailyStats = [
            { date: "10/15", count: 12 },
            { date: "10/16", count: 19 },
            { date: "10/17", count: 15 },
            { date: "10/18", count: 8 },
            { date: "10/19", count: 14 },
            { date: "10/20", count: 10 },
            { date: "10/21", count: 7 },
        ];
        const clientStats = [
            { name: "株式会社テクノソリューション", count: 12 },
            { name: "グローバル商事株式会社", count: 8 },
            { name: "未来工業株式会社", count: 15 },
            { name: "エコシステム株式会社", count: 7 },
            { name: "ヘルスケア株式会社", count: 5 },
        ];
        const statusStats = [
            { name: "確定", value: 65, color: "#4ade80" },
            { name: "未確定", value: 25, color: "#facc15" },
            { name: "キャンセル", value: 10, color: "#f87171" },
        ];
        const timeSlotStats = [
            { time: "9:00-10:00", count: 8 },
            { time: "10:00-11:00", count: 12 },
            { time: "11:00-12:00", count: 15 },
            { time: "13:00-14:00", count: 10 },
            { time: "14:00-15:00", count: 18 },
            { time: "15:00-16:00", count: 14 },
            { time: "16:00-17:00", count: 7 },
        ];
        if (query.exhibitionId && query.exhibitionId !== 'all') {
            if (query.exhibitionId === '1') {
                industryStats[0].value = 40;
                industryStats[1].value = 20;
                dailyStats[0].count = 15;
            }
            else if (query.exhibitionId === '2') {
                industryStats[0].value = 30;
                industryStats[1].value = 35;
                dailyStats[0].count = 10;
            }
            else if (query.exhibitionId === '3') {
                industryStats[0].value = 25;
                industryStats[1].value = 15;
                dailyStats[0].count = 8;
            }
        }
        if (query.period) {
            switch (query.period) {
                case 'week':
                    break;
                case 'month':
                    dailyStats.push({ date: "10/22", count: 9 });
                    dailyStats.push({ date: "10/23", count: 11 });
                    dailyStats.push({ date: "10/24", count: 13 });
                    break;
                case 'quarter':
                    dailyStats.push({ date: "10/30", count: 20 });
                    dailyStats.push({ date: "11/15", count: 25 });
                    dailyStats.push({ date: "11/30", count: 18 });
                    dailyStats.push({ date: "12/15", count: 22 });
                    break;
            }
        }
        const summary = {
            totalMeetings: statusStats.reduce((acc, curr) => acc + curr.value, 0),
            confirmationRate: statusStats[0].value,
            cancellationRate: statusStats[2].value,
        };
        return {
            industryStats,
            dailyStats,
            clientStats,
            statusStats,
            timeSlotStats,
            summary,
        };
    }
    async getTimeSeriesData(query) {
        const { startDate, endDate, metric, groupBy } = query;
        const dates = [];
        const data = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            dates.push(dateStr);
            if (metric === 'meetings') {
                data.push(Math.floor(Math.random() * 30) + 5);
            }
            else if (metric === 'conversion') {
                data.push((Math.random() * 0.4 + 0.3) * 100);
            }
            else {
                data.push(Math.floor(Math.random() * 100));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return {
            labels: dates,
            data,
            metric,
        };
    }
    async getExhibitionStats(exhibitionId) {
        const exhibitionData = {
            '1': {
                name: '東京ビジネスエキスポ2023',
                attendees: 1250,
                meetings: 142,
                conversionRate: 65,
                topClients: [
                    { name: '株式会社テクノソリューション', meetings: 12 },
                    { name: 'グローバル商事株式会社', meetings: 8 },
                    { name: '未来工業株式会社', meetings: 15 },
                ],
            },
            '2': {
                name: '大阪産業フェア2023',
                attendees: 950,
                meetings: 104,
                conversionRate: 58,
                topClients: [
                    { name: 'エコシステム株式会社', meetings: 7 },
                    { name: 'ヘルスケア株式会社', meetings: 5 },
                    { name: '関西電子工業株式会社', meetings: 9 },
                ],
            },
            '3': {
                name: '名古屋テクノロジーショー2023',
                attendees: 750,
                meetings: 87,
                conversionRate: 72,
                topClients: [
                    { name: '中部自動車部品株式会社', meetings: 11 },
                    { name: 'テクノマシナリー株式会社', meetings: 7 },
                    { name: '先端素材研究所', meetings: 6 },
                ],
            },
        };
        return exhibitionData[exhibitionId] || {
            name: '不明な展示会',
            attendees: 0,
            meetings: 0,
            conversionRate: 0,
            topClients: [],
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof StatsRepository !== "undefined" && StatsRepository) === "function" ? _a : Object, typeof (_b = typeof receipt_service_1.ReceiptService !== "undefined" && receipt_service_1.ReceiptService) === "function" ? _b : Object, typeof (_c = typeof feedback_service_1.FeedbackService !== "undefined" && feedback_service_1.FeedbackService) === "function" ? _c : Object])
], StatsService);
//# sourceMappingURL=stats.service.js.map