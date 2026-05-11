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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return {
            status: 'success',
            data: this.appService.getHello()
        };
    }
    getHealth() {
        return {
            status: 'success',
            data: new Date().toISOString(),
        };
    }
    getVersion() {
        return {
            status: 'success',
            data: {
                version: 'v9-native-https',
                commit: '5394beb',
                loginMethod: 'node-native-https',
                deployedAt: new Date().toISOString(),
            },
        };
    }
    getConfigCheck() {
        return {
            status: 'success',
            data: {
                cozeModel: process.env.COZE_MODEL || '未配置',
                cozeApiBase: process.env.COZE_API_BASE || '未配置',
                cozeApiKey: process.env.COZE_API_KEY ? `${process.env.COZE_API_KEY.substring(0, 10)}...` : '未配置',
                useMock: process.env.COZE_USE_MOCK || 'false',
                nodeEnv: process.env.NODE_ENV || 'development',
                wechatAppId: process.env.WECHAT_APPID || process.env.WECHAT_APP_ID || '未配置',
            }
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('hello'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('version'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getVersion", null);
__decorate([
    (0, common_1.Get)('config-check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getConfigCheck", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map