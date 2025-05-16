"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const receipt_controller_1 = require("./receipt.controller");
const receipt_service_1 = require("./receipt.service");
const tag_service_1 = require("./tag/tag.service");
const receipt_entity_1 = require("./entities/receipt.entity");
const tag_entity_1 = require("./entities/tag.entity");
const vector_search_service_1 = require("../../services/vector/vector-search.service");
let ReceiptModule = class ReceiptModule {
};
exports.ReceiptModule = ReceiptModule;
exports.ReceiptModule = ReceiptModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([receipt_entity_1.Receipt, tag_entity_1.Tag]),
        ],
        controllers: [receipt_controller_1.ReceiptController],
        providers: [
            receipt_service_1.ReceiptService,
            tag_service_1.TagService,
            vector_search_service_1.VectorSearchService,
            {
                provide: 'VECTOR_INDEX_CONFIG',
                useValue: {
                    dimensions: 1536,
                    metric: 'cosine',
                    indexType: 'hnsw',
                }
            }
        ],
        exports: [receipt_service_1.ReceiptService, tag_service_1.TagService]
    })
], ReceiptModule);
//# sourceMappingURL=receipt.module.js.map