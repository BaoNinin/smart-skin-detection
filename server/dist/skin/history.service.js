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
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const supabase_client_1 = require("../storage/database/supabase-client");
let HistoryService = class HistoryService {
    constructor(userService) {
        this.userService = userService;
        console.log('HistoryService 初始化完成，使用 Supabase 数据库存储');
    }
    async getHistory(userId) {
        if (!userId) {
            console.warn('历史记录查询未提供用户ID');
            return [];
        }
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('skin_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) {
            console.error('查询历史记录失败:', error);
            throw error;
        }
        return (data || []).map((r) => ({
            id: r.id,
            skin_type: r.skin_type,
            concerns: r.concerns || [],
            moisture: r.moisture,
            oiliness: r.oiliness,
            sensitivity: r.sensitivity,
            acne: r.acne || 0,
            wrinkles: r.wrinkles || 0,
            spots: r.spots || 0,
            pores: r.pores || 0,
            blackheads: r.blackheads || 0,
            recommendations: r.recommendations || [],
            image_url: r.image_url || null,
            created_at: r.created_at,
        }));
    }
    async saveHistory(record) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('skin_history')
            .insert({
            user_id: record.userId,
            skin_type: record.skinType,
            concerns: record.concerns || [],
            moisture: record.moisture,
            oiliness: record.oiliness,
            sensitivity: record.sensitivity,
            acne: record.acne || 0,
            wrinkles: record.wrinkles || 0,
            spots: record.spots || 0,
            pores: record.pores || 0,
            blackheads: record.blackheads || 0,
            recommendations: record.recommendations || [],
            image_url: record.imageUrl || null,
        })
            .select()
            .single();
        if (error) {
            console.error('保存历史记录失败:', error);
            throw error;
        }
        console.log(`保存历史记录成功，ID: ${data.id}, 用户ID: ${record.userId}`);
        await this.userService.incrementDetectionCount(record.userId);
        return data;
    }
    async deleteHistory(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { error, count } = await client
            .from('skin_history')
            .delete({ count: 'exact' })
            .eq('id', parseInt(id));
        if (error) {
            console.error('删除历史记录失败:', error);
            throw error;
        }
        if (count === 0) {
            throw new Error('记录不存在');
        }
        console.log(`删除历史记录成功，ID: ${id}`);
        return { success: true };
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], HistoryService);
//# sourceMappingURL=history.service.js.map