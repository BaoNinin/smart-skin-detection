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
const fs = require("fs/promises");
const path = require("path");
let HistoryService = class HistoryService {
    constructor(userService) {
        this.userService = userService;
        this.nextId = 1;
        this.dataDir = path.join(process.cwd(), 'data');
        this.historyFilePath = path.join(this.dataDir, 'history.json');
        this.ensureDataDir();
        console.log('HistoryService 初始化完成，使用本地文件存储');
    }
    async ensureDataDir() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
        }
        catch (error) {
            console.error('创建数据目录失败:', error);
        }
    }
    async readHistoryFile() {
        try {
            const data = await fs.readFile(this.historyFilePath, 'utf-8');
            const records = JSON.parse(data);
            if (records.length > 0) {
                const maxId = Math.max(...records.map(r => r.id));
                this.nextId = maxId + 1;
            }
            return records;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }
    async writeHistoryFile(records) {
        try {
            await fs.writeFile(this.historyFilePath, JSON.stringify(records, null, 2), 'utf-8');
        }
        catch (error) {
            console.error('写入历史记录文件失败:', error);
            throw error;
        }
    }
    async getHistory(userId) {
        try {
            if (!userId) {
                console.warn('历史记录查询未提供用户ID，返回空数组');
                return [];
            }
            const allRecords = await this.readHistoryFile();
            const userRecords = allRecords
                .filter(record => record.userId === userId)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 50);
            const formattedData = userRecords.map((record) => ({
                id: record.id,
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
                created_at: record.createdAt
            }));
            console.log(`查询到用户 ${userId} 的 ${formattedData.length} 条历史记录`);
            return formattedData;
        }
        catch (error) {
            console.error('获取历史记录失败:', error);
            throw error;
        }
    }
    async saveHistory(record) {
        try {
            const timestamp = new Date().toISOString();
            const allRecords = await this.readHistoryFile();
            const newRecord = {
                id: this.nextId++,
                userId: record.userId,
                skinType: record.skinType,
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
                imageUrl: record.imageUrl || null,
                createdAt: timestamp,
                updatedAt: timestamp
            };
            allRecords.push(newRecord);
            await this.writeHistoryFile(allRecords);
            console.log(`保存历史记录成功，ID: ${newRecord.id}, 用户ID: ${record.userId}`);
            await this.userService.incrementDetectionCount(record.userId);
            return newRecord;
        }
        catch (error) {
            console.error('保存历史记录失败:', error);
            throw error;
        }
    }
    async deleteHistory(id) {
        try {
            const allRecords = await this.readHistoryFile();
            const filteredRecords = allRecords.filter(record => record.id !== parseInt(id));
            if (filteredRecords.length === allRecords.length) {
                throw new Error('记录不存在');
            }
            await this.writeHistoryFile(filteredRecords);
            console.log(`删除历史记录成功，ID: ${id}`);
            return { success: true };
        }
        catch (error) {
            console.error('删除历史记录失败:', error);
            throw error;
        }
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], HistoryService);
//# sourceMappingURL=history.service.js.map