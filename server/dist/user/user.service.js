"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../storage/database/supabase-client");
const crypto = require("miniprogram-sm-crypto");
const https = require("https");
let UserService = class UserService {
    exchangeWechatCode(code) {
        const appid = process.env.WECHAT_APPID;
        const secret = process.env.WECHAT_APPSECRET;
        if (!appid || !secret) {
            throw new Error('微信小程序 AppID 或 AppSecret 未配置');
        }
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
        return new Promise((resolve, reject) => {
            https.get(url, { rejectUnauthorized: false }, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        if (data.errcode) {
                            console.error('微信登录失败:', data);
                            reject(new Error(`微信登录失败: ${data.errmsg || '未知错误'} (errcode: ${data.errcode})`));
                        }
                        else {
                            resolve({ openid: data.openid, session_key: data.session_key });
                        }
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            }).on('error', (error) => {
                console.error('调用微信 API 失败:', error);
                reject(error);
            });
        });
    }
    async login(wechatLoginDto) {
        const { code, userInfo } = wechatLoginDto;
        const { openid } = await this.exchangeWechatCode(code);
        console.log('微信登录成功，openid:', openid.substring(0, 10) + '...');
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: existingUsers, error: queryError } = await client
            .from('users')
            .select('*')
            .eq('openid', openid)
            .limit(1);
        if (queryError) {
            console.error('查询用户失败:', queryError);
            throw queryError;
        }
        let userId;
        let isNewUser = false;
        if (existingUsers && existingUsers.length > 0) {
            userId = existingUsers[0].id;
            const { error: updateError } = await client
                .from('users')
                .update({
                nickname: userInfo?.nickName || existingUsers[0].nickname,
                avatar_url: userInfo?.avatarUrl || existingUsers[0].avatar_url,
                updated_at: new Date().toISOString()
            })
                .eq('id', userId);
            if (updateError) {
                console.error('更新用户失败:', updateError);
                throw updateError;
            }
        }
        else {
            const { data: newUsers, error: insertError } = await client
                .from('users')
                .insert({
                openid,
                nickname: userInfo?.nickName || null,
                avatar_url: userInfo?.avatarUrl || null,
                detection_count: 0
            })
                .select();
            if (insertError) {
                console.error('创建用户失败:', insertError);
                throw insertError;
            }
            userId = newUsers[0].id;
            isNewUser = true;
        }
        const { data: users, error: fetchError } = await client
            .from('users')
            .select('*')
            .eq('id', userId)
            .limit(1);
        if (fetchError || !users || users.length === 0) {
            throw new Error('获取用户信息失败');
        }
        return {
            userInfo: this.toUserInfoDto(users[0]),
            isNewUser
        };
    }
    async loginWithPhoneNumber(phoneNumberLoginDto) {
        const { code, encryptedData, iv } = phoneNumberLoginDto;
        const client = (0, supabase_client_1.getSupabaseClient)();
        const sessionKey = code;
        let phoneNumber;
        try {
            const decrypted = crypto.decrypt(encryptedData, sessionKey, iv, 'aes-256-cbc');
            const phoneInfo = JSON.parse(decrypted);
            phoneNumber = phoneInfo.phoneNumber;
            console.log('解密后的手机号:', phoneNumber);
        }
        catch (error) {
            console.error('解密手机号失败:', error);
            throw new Error('解密手机号失败');
        }
        const { data: existingUsers, error: queryError } = await client
            .from('users')
            .select('*')
            .eq('phone_number', phoneNumber)
            .limit(1);
        if (queryError) {
            console.error('查询用户失败:', queryError);
            throw queryError;
        }
        let userId;
        let isNewUser = false;
        if (existingUsers && existingUsers.length > 0) {
            userId = existingUsers[0].id;
            const { error: updateError } = await client
                .from('users')
                .update({
                updated_at: new Date().toISOString()
            })
                .eq('id', userId);
            if (updateError) {
                console.error('更新用户失败:', updateError);
                throw updateError;
            }
        }
        else {
            const { data: newUsers, error: insertError } = await client
                .from('users')
                .insert({
                phone_number: phoneNumber,
                nickname: `用户${phoneNumber.slice(-4)}`,
                detection_count: 0
            })
                .select();
            if (insertError) {
                console.error('创建用户失败:', insertError);
                throw insertError;
            }
            userId = newUsers[0].id;
            isNewUser = true;
        }
        const { data: users, error: fetchError } = await client
            .from('users')
            .select('*')
            .eq('id', userId)
            .limit(1);
        if (fetchError || !users || users.length === 0) {
            throw new Error('获取用户信息失败');
        }
        return {
            userInfo: this.toUserInfoDto(users[0]),
            isNewUser
        };
    }
    async getUserById(userId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('users')
            .select('*')
            .eq('id', userId)
            .limit(1);
        if (error || !data || data.length === 0) {
            throw new Error('用户不存在');
        }
        return this.toUserInfoDto(data[0]);
    }
    async getUserByOpenid(openid) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('users')
            .select('*')
            .eq('openid', openid)
            .limit(1);
        if (error || !data || data.length === 0) {
            throw new Error('用户不存在');
        }
        return this.toUserInfoDto(data[0]);
    }
    async updateUserInfo(userId, updateDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const updateData = {
            updated_at: new Date().toISOString()
        };
        if (updateDto.nickname !== undefined) {
            updateData.nickname = updateDto.nickname;
        }
        if (updateDto.avatarUrl !== undefined) {
            updateData.avatar_url = updateDto.avatarUrl;
        }
        if (updateDto.phoneNumber !== undefined) {
            updateData.phone_number = updateDto.phoneNumber;
        }
        const { error } = await client
            .from('users')
            .update(updateData)
            .eq('id', userId);
        if (error) {
            console.error('更新用户信息失败:', error);
            throw error;
        }
        const { data, error: fetchError } = await client
            .from('users')
            .select('*')
            .eq('id', userId)
            .limit(1);
        if (fetchError || !data || data.length === 0) {
            throw new Error('获取更新后的用户信息失败');
        }
        return this.toUserInfoDto(data[0]);
    }
    async incrementDetectionCount(userId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: users, error: queryError } = await client
            .from('users')
            .select('*')
            .eq('id', userId)
            .limit(1);
        if (queryError || !users || users.length === 0) {
            throw new Error('用户不存在');
        }
        const { error: updateError } = await client
            .from('users')
            .update({
            detection_count: users[0].detection_count + 1,
            updated_at: new Date().toISOString()
        })
            .eq('id', userId);
        if (updateError) {
            console.error('更新检测次数失败:', updateError);
            throw updateError;
        }
        const { data: updatedUsers, error: fetchError } = await client
            .from('users')
            .select('*')
            .eq('id', userId)
            .limit(1);
        if (fetchError || !updatedUsers || updatedUsers.length === 0) {
            throw new Error('获取更新后的用户信息失败');
        }
        return this.toUserInfoDto(updatedUsers[0]);
    }
    toUserInfoDto(user) {
        return {
            id: user.id,
            openid: user.openid || null,
            phoneNumber: user.phone_number || null,
            nickname: user.nickname,
            avatarUrl: user.avatar_url,
            detectionCount: user.detection_count,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map