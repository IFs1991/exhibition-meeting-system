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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const database_config_1 = require("../../config/database-config");
const user_entity_1 = require("../entities/user.entity");
let UserRepository = class UserRepository {
    constructor(userRepository, dataSource, dbConfig) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
        this.dbConfig = dbConfig;
    }
    async findById(id) {
        return this.userRepository.findOne({
            where: { id },
            cache: this.dbConfig.queryCache.enabled,
        });
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
            cache: this.dbConfig.queryCache.enabled,
        });
    }
    async create(createUserDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = this.userRepository.create(createUserDto);
            const savedUser = await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return savedUser;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async update(id, updateUserDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(user_entity_1.User, { where: { id } });
            if (!user) {
                throw new Error('User not found');
            }
            Object.assign(user, updateUserDto);
            const updatedUser = await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return updatedUser;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async delete(id) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOne(user_entity_1.User, { where: { id } });
            if (!user) {
                throw new Error('User not found');
            }
            await queryRunner.manager.remove(user);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAllWithPagination(page, limit) {
        return this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            cache: this.dbConfig.queryCache.enabled,
        });
    }
    async findByRole(role) {
        return this.userRepository.createQueryBuilder('user')
            .where('user.role = :role', { role })
            .cache(this.dbConfig.queryCache.ttl)
            .getMany();
    }
    async updateLastLogin(id) {
        await this.userRepository.update(id, {
            lastLoginAt: new Date(),
        });
    }
    async withTransaction(operation) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const result = await operation(queryRunner);
            await queryRunner.commitTransaction();
            return result;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _b : Object, typeof (_c = typeof database_config_1.DatabaseConfig !== "undefined" && database_config_1.DatabaseConfig) === "function" ? _c : Object])
], UserRepository);
//# sourceMappingURL=user.repository.js.map