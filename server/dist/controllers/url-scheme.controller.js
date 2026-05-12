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
exports.URLSchemeController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let URLSchemeController = class URLSchemeController {
    constructor(configService) {
        this.configService = configService;
        this.accessToken = null;
    }
    async generateURLScheme(body) {
        try {
            const { path = 'pages/landing/index', query = {} } = body;
            console.log('=== 生成 URL Scheme ===');
            console.log('路径:', path);
            console.log('参数:', query);
            const accessToken = await this.getAccessToken();
            if (!accessToken) {
                throw new Error('无法获取微信 Access Token');
            }
            console.log('Access Token 获取成功:', accessToken.substring(0, 10) + '...');
            const response = await axios_1.default.post('https://api.weixin.qq.com/wxa/generatescheme', {
                jump_wxa: {
                    path,
                    query: this.buildQuery(query),
                },
                is_expire: true,
                expire_type: 1,
                expire_interval: 30,
            }, {
                params: {
                    access_token: accessToken,
                },
            });
            console.log('微信 API 响应:', response.data);
            if (response.data.errcode !== 0) {
                throw new Error(`微信 API 错误: ${response.data.errmsg}`);
            }
            const openlink = response.data.openlink;
            console.log('生成的 URL Scheme:', openlink);
            return {
                code: 200,
                msg: '生成成功',
                data: {
                    openlink,
                    expiresIn: 30,
                    path,
                    query,
                },
            };
        }
        catch (error) {
            console.error('生成 URL Scheme 失败:', error);
            return {
                code: 500,
                msg: error.message || '生成失败',
                data: null,
            };
        }
    }
    async generateNFCData(body) {
        try {
            const { deviceId = 'DEVICE_001', page = '/pages/camera/index', action = 'analyze' } = body;
            console.log('=== 生成 NFC 数据 ===');
            console.log('设备 ID:', deviceId);
            console.log('页面:', page);
            console.log('操作:', action);
            const urlSchemeResult = await this.generateURLScheme({
                path: page.replace(/^\//, ''),
                query: {
                    from: 'nfc',
                    action,
                    deviceId,
                },
            });
            if (urlSchemeResult.code !== 200) {
                throw new Error('生成 URL Scheme 失败');
            }
            const customData = {
                action,
                page,
                deviceId,
                timestamp: Date.now(),
            };
            if (!urlSchemeResult.data) {
                throw new Error('生成 URL Scheme 失败：返回数据为空');
            }
            return {
                code: 200,
                msg: '生成成功',
                data: {
                    urlScheme: urlSchemeResult.data.openlink,
                    nfcDataFormat: 'URI',
                    customData: JSON.stringify(customData),
                    customDataFormat: 'TEXT',
                    recommended: 'urlScheme',
                    recommendedFormat: 'URI',
                },
            };
        }
        catch (error) {
            console.error('生成 NFC 数据失败:', error);
            return {
                code: 500,
                msg: error.message || '生成失败',
                data: null,
            };
        }
    }
    async getAccessToken() {
        try {
            const appid = this.configService.get('WECHAT_APPID');
            const secret = this.configService.get('WECHAT_APPSECRET');
            if (!appid || !secret) {
                console.error('微信 AppID 或 AppSecret 未配置');
                return null;
            }
            console.log('获取微信 Access Token...');
            console.log('AppID:', appid);
            const response = await axios_1.default.get('https://api.weixin.qq.com/cgi-bin/token', {
                params: {
                    grant_type: 'client_credential',
                    appid,
                    secret,
                },
            });
            if (response.data.errcode) {
                console.error('获取 Access Token 失败:', response.data);
                return null;
            }
            if (!response.data.access_token) {
                console.error('获取 Access Token 失败: 响应中没有 access_token', response.data);
                return null;
            }
            const accessToken = response.data.access_token;
            console.log('Access Token 获取成功');
            return accessToken;
        }
        catch (error) {
            console.error('获取 Access Token 异常:', error);
            return null;
        }
    }
    buildQuery(query) {
        const queryString = Object.keys(query)
            .map((key) => {
            const value = query[key];
            if (typeof value === 'object') {
                return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
            }
            return `${key}=${encodeURIComponent(value)}`;
        })
            .join('&');
        return queryString;
    }
};
exports.URLSchemeController = URLSchemeController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], URLSchemeController.prototype, "generateURLScheme", null);
__decorate([
    (0, common_1.Post)('nfc-data'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], URLSchemeController.prototype, "generateNFCData", null);
exports.URLSchemeController = URLSchemeController = __decorate([
    (0, common_1.Controller)('url-scheme'),
    __metadata("design:paramtypes", [config_1.ConfigService])
], URLSchemeController);
//# sourceMappingURL=url-scheme.controller.js.map