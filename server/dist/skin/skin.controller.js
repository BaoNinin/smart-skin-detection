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
exports.SkinController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const skin_service_1 = require("./skin.service");
let SkinController = class SkinController {
    constructor(skinService) {
        this.skinService = skinService;
    }
    async analyzeSkin(file, userId) {
        if (!file) {
            throw new common_1.BadRequestException('未上传图片');
        }
        if (!userId) {
            throw new common_1.BadRequestException('缺少用户ID');
        }
        console.log('收到皮肤分析请求，文件名:', file.originalname);
        console.log('文件大小:', file.size);
        console.log('用户ID:', userId);
        try {
            const result = await this.skinService.analyzeSkinImage(file);
            return {
                code: 200,
                msg: '分析成功',
                data: result
            };
        }
        catch (error) {
            console.error('皮肤分析失败:', error);
            throw error;
        }
    }
    async checkFace(file) {
        if (!file)
            throw new common_1.BadRequestException('未上传图片');
        const result = await this.skinService.checkFaceAlignment(file);
        return { code: 200, msg: 'ok', data: result };
    }
    async recommendProducts(query) {
        const { skinType, moisture, oiliness, sensitivity, concerns, acne, wrinkles, spots, pores, blackheads } = query;
        const skinData = {
            skinType: skinType || '中性皮肤',
            concerns: concerns ? concerns.split(',').map((c) => c.trim()) : [],
            moisture: parseInt(moisture) || 70,
            oiliness: parseInt(oiliness) || 50,
            sensitivity: parseInt(sensitivity) || 30,
            acne: acne !== undefined ? parseInt(acne) : undefined,
            wrinkles: wrinkles !== undefined ? parseInt(wrinkles) : undefined,
            spots: spots !== undefined ? parseInt(spots) : undefined,
            pores: pores !== undefined ? parseInt(pores) : undefined,
            blackheads: blackheads !== undefined ? parseInt(blackheads) : undefined
        };
        try {
            const products = await this.skinService.recommendProducts(skinData);
            return {
                code: 200,
                msg: '推荐成功',
                data: products
            };
        }
        catch (error) {
            console.error('产品推荐失败:', error);
            throw error;
        }
    }
};
exports.SkinController = SkinController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SkinController.prototype, "analyzeSkin", null);
__decorate([
    (0, common_1.Post)('check-face'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SkinController.prototype, "checkFace", null);
__decorate([
    (0, common_1.Get)('recommend'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SkinController.prototype, "recommendProducts", null);
exports.SkinController = SkinController = __decorate([
    (0, common_1.Controller)('skin'),
    __metadata("design:paramtypes", [skin_service_1.SkinService])
], SkinController);
//# sourceMappingURL=skin.controller.js.map