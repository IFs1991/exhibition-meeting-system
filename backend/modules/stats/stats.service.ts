import { Injectable } from '@nestjs/common';
import { StatsRepository } from '../repositories/stats.repository';
import { ReceiptService } from '../../receipt/receipt.service';
import { FeedbackService } from '../../feedback/feedback.service';
import { DateRange, AnalysisFilter, GroupByOption } from '../dto/stats-request.dto';

// StatsRepositoryの代わりに使用するダミークラス
// 実際の実装では適切なRepositoryを使用する
class StatsRepository {}

@Injectable()
export class StatsService {
  constructor(
    private readonly statsRepository: StatsRepository,
    private readonly receiptService: ReceiptService,
    private readonly feedbackService: FeedbackService,
  ) {}

  async getApprovalStats(dateRange: DateRange) {
    const approvalData = await this.statsRepository.getApprovalRates(dateRange);
    return {
      totalCount: approvalData.total,
      approvedCount: approvalData.approved,
      rejectedCount: approvalData.rejected,
      approvalRate: (approvalData.approved / approvalData.total) * 100,
    };
  }

  async getBodyPartAnalysis(filter: AnalysisFilter) {
    const bodyPartStats = await this.statsRepository.getBodyPartStats(filter);
    const enrichedStats = await Promise.all(
      bodyPartStats.map(async (stat) => {
        const approvalRate = await this.statsRepository.getApprovalRateByBodyPart(
          stat.bodyPart,
          filter.dateRange,
        );
        return {
          ...stat,
          approvalRate,
        };
      }),
    );
    return enrichedStats;
  }

  async getSymptomAnalysis(filter: AnalysisFilter) {
    const symptomStats = await this.statsRepository.getSymptomStats(filter);
    const commonPatterns = await this.analyzeSymptomPatterns(symptomStats);
    return {
      symptoms: symptomStats,
      patterns: commonPatterns,
    };
  }

  async getTimeSeriesAnalysis(dateRange: DateRange, groupBy: GroupByOption) {
    const timeSeriesData = await this.statsRepository.getTimeSeriesStats(dateRange, groupBy);
    const trends = this.calculateTrends(timeSeriesData);
    return {
      timeSeries: timeSeriesData,
      trends,
    };
  }

  async generateReport(filter: AnalysisFilter) {
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

  private analyzeSymptomPatterns(symptomStats: any[]) {
    const patterns = symptomStats.reduce((acc, curr) => {
      const coOccurrences = curr.relatedSymptoms.map((related) => ({
        pair: [curr.symptom, related.symptom],
        count: related.count,
      }));
      return [...acc, ...coOccurrences];
    }, []);

    return patterns.sort((a, b) => b.count - a.count).slice(0, 10);
  }

  private calculateTrends(timeSeriesData: any[]) {
    const movingAverage = this.calculateMovingAverage(timeSeriesData, 7);
    const seasonality = this.detectSeasonality(timeSeriesData);
    const trend = this.calculateTrendLine(timeSeriesData);

    return {
      movingAverage,
      seasonality,
      trend,
    };
  }

  private calculateMovingAverage(data: any[], window: number) {
    return data.map((_, index) => {
      if (index < window - 1) return null;
      const slice = data.slice(index - window + 1, index + 1);
      const sum = slice.reduce((acc, curr) => acc + curr.value, 0);
      return {
        date: data[index].date,
        value: sum / window,
      };
    }).filter(Boolean);
  }

  private detectSeasonality(data: any[]) {
    const weeklyPattern = this.aggregateByDayOfWeek(data);
    const monthlyPattern = this.aggregateByMonthOfYear(data);
    return {
      weekly: weeklyPattern,
      monthly: monthlyPattern,
    };
  }

  private calculateTrendLine(data: any[]) {
    const xValues = data.map((_, i) => i);
    const yValues = data.map((d) => d.value);
    const { slope, intercept } = this.linearRegression(xValues, yValues);

    return data.map((d, i) => ({
      date: d.date,
      value: slope * i + intercept,
    }));
  }

  private linearRegression(x: number[], y: number[]) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  private async generateRecommendations(data: any) {
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

  private aggregateByDayOfWeek(data: any[]) {
    const weekdays = Array(7).fill(0).map(() => ({ count: 0, sum: 0 }));
    data.forEach((d) => {
      const day = new Date(d.date).getDay();
      weekdays[day].count++;
      weekdays[day].sum += d.value;
    });
    return weekdays.map((w) => w.sum / w.count);
  }

  private aggregateByMonthOfYear(data: any[]) {
    const months = Array(12).fill(0).map(() => ({ count: 0, sum: 0 }));
    data.forEach((d) => {
      const month = new Date(d.date).getMonth();
      months[month].count++;
      months[month].sum += d.value;
    });
    return months.map((m) => m.sum / m.count);
  }

  /**
   * 統計データを取得する
   * @param query クエリパラメータ
   */
  async getStats(query: any) {
    // 本来はデータベースからの実データを取得する処理
    // テスト段階ではモックデータを返す

    // 業種別商談データ
    const industryStats = [
      { name: "IT・通信", value: 35, color: "#8884d8" },
      { name: "製造", value: 25, color: "#83a6ed" },
      { name: "商社", value: 18, color: "#8dd1e1" },
      { name: "金融・保険", value: 15, color: "#82ca9d" },
      { name: "建設・不動産", value: 12, color: "#a4de6c" },
      { name: "医療・ヘルスケア", value: 10, color: "#d0ed57" },
      { name: "その他", value: 27, color: "#ffc658" },
    ];

    // 日付別商談データ
    const dailyStats = [
      { date: "10/15", count: 12 },
      { date: "10/16", count: 19 },
      { date: "10/17", count: 15 },
      { date: "10/18", count: 8 },
      { date: "10/19", count: 14 },
      { date: "10/20", count: 10 },
      { date: "10/21", count: 7 },
    ];

    // クライアント別商談データ
    const clientStats = [
      { name: "株式会社テクノソリューション", count: 12 },
      { name: "グローバル商事株式会社", count: 8 },
      { name: "未来工業株式会社", count: 15 },
      { name: "エコシステム株式会社", count: 7 },
      { name: "ヘルスケア株式会社", count: 5 },
    ];

    // ステータス別商談データ
    const statusStats = [
      { name: "確定", value: 65, color: "#4ade80" },
      { name: "未確定", value: 25, color: "#facc15" },
      { name: "キャンセル", value: 10, color: "#f87171" },
    ];

    // 時間帯別商談データ
    const timeSlotStats = [
      { time: "9:00-10:00", count: 8 },
      { time: "10:00-11:00", count: 12 },
      { time: "11:00-12:00", count: 15 },
      { time: "13:00-14:00", count: 10 },
      { time: "14:00-15:00", count: 18 },
      { time: "15:00-16:00", count: 14 },
      { time: "16:00-17:00", count: 7 },
    ];

    // リクエストパラメータに基づくフィルタリング
    // 例: 特定の展示会が指定されている場合
    if (query.exhibitionId && query.exhibitionId !== 'all') {
      // 実際のデータベースクエリでは展示会IDによるフィルタリングを行う
      // ここではモックデータの一部を変更するだけ

      if (query.exhibitionId === '1') {
        // 東京ビジネスエキスポ2023のデータ
        industryStats[0].value = 40;
        industryStats[1].value = 20;
        dailyStats[0].count = 15;
      } else if (query.exhibitionId === '2') {
        // 大阪産業フェア2023のデータ
        industryStats[0].value = 30;
        industryStats[1].value = 35;
        dailyStats[0].count = 10;
      } else if (query.exhibitionId === '3') {
        // 名古屋テクノロジーショー2023のデータ
        industryStats[0].value = 25;
        industryStats[1].value = 15;
        dailyStats[0].count = 8;
      }
    }

    // 期間によるフィルタリング
    if (query.period) {
      switch (query.period) {
        case 'week':
          // 直近1週間のデータ: 現状のモックデータをそのまま使用
          break;
        case 'month':
          // 直近1ヶ月のデータを模したモックデータの調整
          dailyStats.push({ date: "10/22", count: 9 });
          dailyStats.push({ date: "10/23", count: 11 });
          dailyStats.push({ date: "10/24", count: 13 });
          break;
        case 'quarter':
          // 直近3ヶ月のデータを模したモックデータの調整
          dailyStats.push({ date: "10/30", count: 20 });
          dailyStats.push({ date: "11/15", count: 25 });
          dailyStats.push({ date: "11/30", count: 18 });
          dailyStats.push({ date: "12/15", count: 22 });
          break;
      }
    }

    // 集計サマリー
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

  /**
   * 時系列の統計データを取得する
   * @param query クエリパラメータ
   */
  async getTimeSeriesData(query: { startDate: string; endDate: string; metric: string; groupBy?: string }) {
    const { startDate, endDate, metric, groupBy } = query;

    // 本来はデータベースからの時系列データ取得処理
    // テスト段階ではモックデータを返す

    const dates = [];
    const data = [];

    // 仮の日付範囲でデータを生成
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);

      // メトリックに応じたデータ生成
      if (metric === 'meetings') {
        data.push(Math.floor(Math.random() * 30) + 5); // 5～35のランダムな値
      } else if (metric === 'conversion') {
        data.push((Math.random() * 0.4 + 0.3) * 100); // 30%～70%のランダムな値
      } else {
        data.push(Math.floor(Math.random() * 100));
      }

      // 日付を1日進める
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      labels: dates,
      data,
      metric,
    };
  }

  /**
   * 特定の展示会の統計データを取得する
   * @param exhibitionId 展示会ID
   */
  async getExhibitionStats(exhibitionId: string) {
    // 本来はデータベースから特定の展示会のデータを取得する処理
    // テスト段階ではモックデータを返す

    // 仮の展示会データ
    const exhibitionData: Record<string, any> = {
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

    // 指定された展示会のデータを返す
    return exhibitionData[exhibitionId] || {
      name: '不明な展示会',
      attendees: 0,
      meetings: 0,
      conversionRate: 0,
      topClients: [],
    };
  }
}