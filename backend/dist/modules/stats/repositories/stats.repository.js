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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const database_config_1 = require("../../config/database-config");
const receipt_entity_1 = require("../receipt/entities/receipt.entity");
const feedback_entity_1 = require("../feedback/entities/feedback.entity");
let StatsRepository = class StatsRepository {
    constructor(receiptRepository, feedbackRepository, dbConfig) {
        this.receiptRepository = receiptRepository;
        this.feedbackRepository = feedbackRepository;
        this.dbConfig = dbConfig;
    }
    async getApprovalRateByPeriod(startDate, endDate) {
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
    async getMonthlyTrends(year) {
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
    async getUserPerformanceStats(userId) {
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
};
exports.StatsRepository = StatsRepository;
exports.StatsRepository = StatsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(receipt_entity_1.Receipt)),
    __param(1, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof database_config_1.DatabaseConfig !== "undefined" && database_config_1.DatabaseConfig) === "function" ? _c : Object])
], StatsRepository);
//# sourceMappingURL=stats.repository.js.map