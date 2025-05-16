"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedData1709123456789 = void 0;
const bcrypt_1 = require("bcrypt");
class SeedData1709123456789 {
    async up(queryRunner) {
        const defaultTags = [
            { name: '頸部', category: '部位' },
            { name: '腰部', category: '部位' },
            { name: '肩関節', category: '部位' },
            { name: '膝関節', category: '部位' },
            { name: '急性', category: '症状' },
            { name: '慢性', category: '症状' },
            { name: '外傷性', category: '原因' },
            { name: '変形性', category: '原因' },
        ];
        for (const tag of defaultTags) {
            await queryRunner.query(`INSERT INTO tags (name, category) VALUES ($1, $2)`, [tag.name, tag.category]);
        }
        const hashedPassword = await (0, bcrypt_1.hash)('test1234', 10);
        await queryRunner.query(`INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4)`, ['test@example.com', hashedPassword, 'テストユーザー', 'PRACTITIONER']);
        const sampleCases = [
            {
                title: '頸部捻挫の症例',
                symptoms: '頸部痛、可動域制限、筋緊張',
                treatment: '徒手療法、温熱療法',
                tags: ['頸部', '急性', '外傷性'],
            },
            {
                title: '腰部椎間板ヘルニアの症例',
                symptoms: '腰痛、下肢しびれ、歩行困難',
                treatment: '牽引療法、運動療法',
                tags: ['腰部', '慢性', '変形性'],
            },
        ];
        for (const sample of sampleCases) {
            const result = await queryRunner.query(`INSERT INTO receipt_cases (title, symptoms, treatment, created_by) 
         VALUES ($1, $2, $3, (SELECT id FROM users WHERE email = 'test@example.com')) 
         RETURNING id`, [sample.title, sample.symptoms, sample.treatment]);
            const caseId = result[0].id;
            for (const tagName of sample.tags) {
                await queryRunner.query(`INSERT INTO case_tags (case_id, tag_id) 
           SELECT $1, id FROM tags WHERE name = $2`, [caseId, tagName]);
            }
        }
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM case_tags`);
        await queryRunner.query(`DELETE FROM receipt_cases`);
        await queryRunner.query(`DELETE FROM users`);
        await queryRunner.query(`DELETE FROM tags`);
    }
}
exports.SeedData1709123456789 = SeedData1709123456789;
//# sourceMappingURL=seed-data.js.map