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
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const history_service_1 = require("./history.service");
let HistoryController = class HistoryController {
    constructor(historyService) {
        this.historyService = historyService;
    }
    async getHistory(userId) {
        console.log('收到历史记录查询请求', userId ? `用户ID: ${userId}` : '');
        if (!userId) {
            return {
                code: 401,
                msg: '请先登录',
                data: []
            };
        }
        try {
            const result = await this.historyService.getHistory(parseInt(userId));
            return {
                code: 200,
                msg: '查询成功',
                data: result
            };
        }
        catch (error) {
            console.error('查询历史记录失败:', error);
            throw error;
        }
    }
    async saveHistory(body) {
        console.log('收到保存历史记录请求');
        try {
            const result = await this.historyService.saveHistory(body);
            return {
                code: 200,
                msg: '保存成功',
                data: result
            };
        }
        catch (error) {
            console.error('保存历史记录失败:', error);
            throw error;
        }
    }
    async deleteHistory(id) {
        console.log('收到删除历史记录请求，ID:', id);
        try {
            const result = await this.historyService.deleteHistory(id);
            return {
                code: 200,
                msg: '删除成功',
                data: result
            };
        }
        catch (error) {
            console.error('删除历史记录失败:', error);
            throw error;
        }
    }
};
exports.HistoryController = HistoryController;
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('history'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "saveHistory", null);
__decorate([
    (0, common_1.Delete)('history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "deleteHistory", null);
exports.HistoryController = HistoryController = __decorate([
    (0, common_1.Controller)('skin'),
    __metadata("design:paramtypes", [history_service_1.HistoryService])
], HistoryController);
//# sourceMappingURL=history.controller.js.map