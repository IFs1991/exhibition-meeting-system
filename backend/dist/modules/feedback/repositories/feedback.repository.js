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
exports.FeedbackRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const database_config_1 = require("../../config/database-config");
const feedback_entity_1 = require("../entities/feedback.entity");
let FeedbackRepository = class FeedbackRepository {
    constructor(feedbackRepo, dataSource, dbConfig) {
        this.feedbackRepo = feedbackRepo;
        this.dataSource = dataSource;
        this.dbConfig = dbConfig;
    }
    async create(feedback) {
        const newFeedback = this.feedbackRepo.create(feedback);
        return await this.feedbackRepo.save(newFeedback);
    }
    async findById(id) {
        return await this.feedbackRepo.findOne({
            where: { id },
            relations: ['receipt']
        });
    }
    async update(id, feedback) {
        await this.feedbackRepo.update(id, feedback);
        return await this.findById(id);
    }
    async delete(id) {
        await this.feedbackRepo.delete(id);
    }
    async getFeedbacksByReceiptId(receiptId) {
        return await this.feedbackRepo.find({
            where: { receipt: { id: receiptId } },
            order: { createdAt: 'DESC' }
        });
    }
    async getApprovalRateStats(startDate, endDate) {
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
        }
        finally {
            await queryRunner.release();
        }
    }
    async getFeedbacksByCategory(categoryId, limit = 10) {
        return await this.feedbackRepo
            .createQueryBuilder('feedback')
            .innerJoinAndSelect('feedback.receipt', 'receipt')
            .where('receipt.categoryId = :categoryId', { categoryId })
            .orderBy('feedback.createdAt', 'DESC')
            .take(limit)
            .getMany();
    }
    async getRecentRejectionReasons(limit = 5) {
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
    async getFeedbackTrends(days = 30) {
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
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.FeedbackRepository = FeedbackRepository;
exports.FeedbackRepository = FeedbackRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(feedback_entity_1.Feedback)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _b : Object, typeof (_c = typeof database_config_1.DatabaseConfig !== "undefined" && database_config_1.DatabaseConfig) === "function" ? _c : Object])
], FeedbackRepository);
//# sourceMappingURL=feedback.repository.js.map