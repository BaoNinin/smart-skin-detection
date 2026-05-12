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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    redirectToMiniProgram(res) {
        const scheme = 'weixin://dl/business/?appid=wx8826c7b681ec3c65&path=pages/landing/index&env_version=release';
        res.send(`<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>正在打开小程序…</title>
<style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5}.card{text-align:center;background:#fff;border-radius:20px;padding:40px 30px;box-shadow:0 10px 40px rgba(0,0,0,.1);max-width:320px}.spinner{width:40px;height:40px;margin:0 auto 20px;border:3px solid #eee;border-top-color:#07c160;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}h2{color:#333;margin:0 0 8px;font-size:20px}p{color:#999;margin:0 0 24px;font-size:14px}.btn{display:block;width:100%;padding:12px;background:#07c160;color:#fff;border:none;border-radius:10px;font-size:16px;text-decoration:none;margin-bottom:10px;cursor:pointer}.btn-outline{background:#fff;color:#07c160;border:1px solid #07c160}</style>
</head>
<body>
<div class="card">
<div class="spinner"></div>
<h2>正在打开小程序</h2>
<p>智能皮肤检测</p>
<a class="btn" href="${scheme}">打开小程序</a>
<p style="font-size:12px;color:#ccc">如未自动跳转，请点击上方按钮</p>
</div>
<script>
(function(){
  var ua=navigator.userAgent.toLowerCase();
  if(ua.indexOf('micromessenger')!==-1||ua.indexOf('android')!==-1||ua.indexOf('iphone')!==-1||ua.indexOf('ipad')!==-1){
    setTimeout(function(){window.location.href='${scheme}';},300);
  }
})();
</script>
</body></html>`);
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
    (0, common_1.Get)('nfc'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "redirectToMiniProgram", null);
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