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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const skin_service_1 = require("./skin.service");
let ProductController = class ProductController {
    constructor(skinService) {
        this.skinService = skinService;
    }
    async getRecommendations(skinType, concerns, moisture, oiliness, sensitivity) {
        console.log('收到产品推荐请求:', { skinType, concerns, moisture, oiliness, sensitivity });
        if (!skinType) {
            throw new common_1.BadRequestException('缺少皮肤类型参数');
        }
        try {
            const result = await this.skinService.recommendProducts({
                skinType,
                concerns: concerns ? concerns.split(',') : [],
                moisture: moisture ? parseInt(moisture) : 50,
                oiliness: oiliness ? parseInt(oiliness) : 50,
                sensitivity: sensitivity ? parseInt(sensitivity) : 30
            });
            return {
                code: 200,
                msg: '推荐成功',
                data: result
            };
        }
        catch (error) {
            console.error('产品推荐失败:', error);
            throw error;
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)('recommend'),
    __param(0, (0, common_1.Query)('skinType')),
    __param(1, (0, common_1.Query)('concerns')),
    __param(2, (0, common_1.Query)('moisture')),
    __param(3, (0, common_1.Query)('oiliness')),
    __param(4, (0, common_1.Query)('sensitivity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getRecommendations", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('skin'),
    __metadata("design:paramtypes", [skin_service_1.SkinService])
], ProductController);
//# sourceMappingURL=product.controller.js.map