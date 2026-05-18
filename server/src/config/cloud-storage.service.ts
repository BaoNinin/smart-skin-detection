import { Injectable } from '@nestjs/common';
const cloud = require('wx-server-sdk');
import * as fs from 'fs';
import { UploadedFile } from '@/skin/skin.types';

@Injectable()
export class CloudStorageService {
  constructor() {
    console.log('CloudStorageService 初始化完成，使用云存储');
  }

  /**
   * 上传文件到云存储
   * @param file 上传的文件
   * @param filePath 云存储路径
   * @returns 文件 URL
   */
  async uploadFile(file: UploadedFile, filePath?: string): Promise<string> {
    try {
      // 如果没有指定路径，生成一个基于时间戳的路径
      const cloudPath = filePath || `skin-analysis/${Date.now()}-${file.originalname}`;

      let fileBuffer: Buffer;

      // 获取文件内容
      if (file.path) {
        fileBuffer = fs.readFileSync(file.path);
      } else if (file.buffer) {
        fileBuffer = file.buffer;
      } else {
        throw new Error('无法读取文件数据');
      }

      // 上传到云存储
      const result = await cloud.uploadFile({
        cloudPath: cloudPath,
        fileContent: fileBuffer,
      });

      console.log('文件上传成功:', result.fileID);

      // 获取文件临时链接（有效期 2 小时）
      const urlResult = await cloud.getTempFileURL({
        fileList: [result.fileID],
      });

      return urlResult.fileList[0].tempFileURL;
    } catch (error) {
      console.error('云存储上传失败:', error);
      throw error;
    }
  }

  /**
   * 删除云存储文件
   * @param fileID 云存储文件 ID
   */
  async deleteFile(fileID: string): Promise<void> {
    try {
      await cloud.deleteFile({
        fileList: [fileID],
      });
      console.log('文件删除成功:', fileID);
    } catch (error) {
      console.error('云存储删除失败:', error);
      throw error;
    }
  }

  /**
   * 上传文件到云存储，返回永久 fileID
   * @param file 上传的文件
   * @param filePath 云存储路径
   * @returns cloud:// 格式的永久文件 ID
   */
  async uploadFileReturnFileID(file: UploadedFile, filePath?: string): Promise<string> {
    try {
      const cloudPath = filePath || `skin-analysis/${Date.now()}-${file.originalname}`;
      let fileBuffer: Buffer;
      if (file.path) {
        fileBuffer = fs.readFileSync(file.path);
      } else if (file.buffer) {
        fileBuffer = file.buffer;
      } else {
        throw new Error('无法读取文件数据');
      }

      const result = await cloud.uploadFile({
        cloudPath: cloudPath,
        fileContent: fileBuffer,
      });

      console.log('文件上传成功，fileID:', result.fileID);
      return result.fileID; // cloud:// 格式，永久有效
    } catch (error) {
      console.error('云存储上传失败:', error);
      throw error;
    }
  }

  /**
   * 批量获取文件临时链接
   * @param fileIDs 云存储文件 ID 数组
   * @returns fileID → tempURL 的 Map
   */
  async getTempFileURLs(fileIDs: string[]): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    if (fileIDs.length === 0) return result;

    try {
      const res = await cloud.getTempFileURL({ fileList: fileIDs });
      for (const item of res.fileList) {
        if (item.tempFileURL) {
          result.set(item.fileID, item.tempFileURL);
        }
      }
    } catch (error) {
      console.error('批量获取临时链接失败:', error);
    }
    return result;
  }

  /**
   * 获取文件临时链接
   * @param fileID 云存储文件 ID
   * @returns 临时 URL
   */
  async getTempFileURL(fileID: string): Promise<string> {
    try {
      const result = await cloud.getTempFileURL({
        fileList: [fileID],
      });
      return result.fileList[0].tempFileURL;
    } catch (error) {
      console.error('获取临时链接失败:', error);
      throw error;
    }
  }
}
