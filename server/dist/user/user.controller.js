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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async login(wechatLoginDto) {
        try {
            const result = await this.userService.login(wechatLoginDto);
            return {
                code: 200,
                msg: result.isNewUser ? '登录成功，欢迎新用户' : '登录成功',
                data: result.userInfo
            };
        }
        catch (error) {
            console.error('登录失败:', error);
            return {
                code: 500,
                msg: error.message || '登录失败，请稍后重试',
                data: null
            };
        }
    }
    async loginWithPhone(phoneNumberLoginDto) {
        const result = await this.userService.loginWithPhoneNumber(phoneNumberLoginDto);
        return {
            code: 200,
            msg: result.isNewUser ? '登录成功，欢迎新用户' : '登录成功',
            data: result.userInfo
        };
    }
    async getUserInfo(userId) {
        const userInfo = await this.userService.getUserById(parseInt(userId));
        return {
            code: 200,
            msg: '获取成功',
            data: userInfo
        };
    }
    async updateUserInfo(userId, updateDto) {
        const userInfo = await this.userService.updateUserInfo(parseInt(userId), updateDto);
        return {
            code: 200,
            msg: '更新成功',
            data: userInfo
        };
    }
    async incrementDetectionCount(userId) {
        const userInfo = await this.userService.incrementDetectionCount(parseInt(userId));
        return {
            code: 200,
            msg: '检测次数更新成功',
            data: userInfo
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login/phone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginWithPhone", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Put)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserInfo", null);
__decorate([
    (0, common_1.Post)(':userId/increment-detection'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "incrementDetectionCount", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map