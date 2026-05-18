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
exports.CloudStorageService = void 0;
const common_1 = require("@nestjs/common");
const cloud = require('wx-server-sdk');
const fs = require("fs");
let CloudStorageService = class CloudStorageService {
    constructor() {
        console.log('CloudStorageService 初始化完成，使用云存储');
    }
    async uploadFile(file, filePath) {
        try {
            const cloudPath = filePath || `skin-analysis/${Date.now()}-${file.originalname}`;
            let fileBuffer;
            if (file.path) {
                fileBuffer = fs.readFileSync(file.path);
            }
            else if (file.buffer) {
                fileBuffer = file.buffer;
            }
            else {
                throw new Error('无法读取文件数据');
            }
            const result = await cloud.uploadFile({
                cloudPath: cloudPath,
                fileContent: fileBuffer,
            });
            console.log('文件上传成功:', result.fileID);
            const urlResult = await cloud.getTempFileURL({
                fileList: [result.fileID],
            });
            return urlResult.fileList[0].tempFileURL;
        }
        catch (error) {
            console.error('云存储上传失败:', error);
            throw error;
        }
    }
    async deleteFile(fileID) {
        try {
            await cloud.deleteFile({
                fileList: [fileID],
            });
            console.log('文件删除成功:', fileID);
        }
        catch (error) {
            console.error('云存储删除失败:', error);
            throw error;
        }
    }
    async uploadFileReturnFileID(file, filePath) {
        try {
            const cloudPath = filePath || `skin-analysis/${Date.now()}-${file.originalname}`;
            let fileBuffer;
            if (file.path) {
                fileBuffer = fs.readFileSync(file.path);
            }
            else if (file.buffer) {
                fileBuffer = file.buffer;
            }
            else {
                throw new Error('无法读取文件数据');
            }
            const result = await cloud.uploadFile({
                cloudPath: cloudPath,
                fileContent: fileBuffer,
            });
            console.log('文件上传成功，fileID:', result.fileID);
            return result.fileID;
        }
        catch (error) {
            console.error('云存储上传失败:', error);
            throw error;
        }
    }
    async getTempFileURLs(fileIDs) {
        const result = new Map();
        if (fileIDs.length === 0)
            return result;
        try {
            const res = await cloud.getTempFileURL({ fileList: fileIDs });
            for (const item of res.fileList) {
                if (item.tempFileURL) {
                    result.set(item.fileID, item.tempFileURL);
                }
            }
        }
        catch (error) {
            console.error('批量获取临时链接失败:', error);
        }
        return result;
    }
    async getTempFileURL(fileID) {
        try {
            const result = await cloud.getTempFileURL({
                fileList: [fileID],
            });
            return result.fileList[0].tempFileURL;
        }
        catch (error) {
            console.error('获取临时链接失败:', error);
            throw error;
        }
    }
};
exports.CloudStorageService = CloudStorageService;
exports.CloudStorageService = CloudStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudStorageService);
//# sourceMappingURL=cloud-storage.service.js.map