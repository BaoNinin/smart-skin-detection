import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Body, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkinService } from './skin.service';
import { UploadedFile as UploadedFileType } from './skin.types';

@Controller('skin')
export class SkinController {
  constructor(private readonly skinService: SkinService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeSkin(
    @UploadedFile() file: UploadedFileType,
    @Query('userId') userId?: string
  ) {
    if (!file) {
      throw new BadRequestException('未上传图片');
    }

    if (!userId) {
      throw new BadRequestException('缺少用户ID');
    }

    console.log('收到皮肤分析请求，文件名:', file.originalname);
    console.log('文件大小:', file.size);
    console.log('用户ID:', userId);

    // 超过 1MB 的图片记录告警，方便排查异常上传
    if (file.size > 1024 * 1024) {
      console.warn(`⚠️ 大图片上传: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
    }

    try {
      const result = await this.skinService.analyzeSkinImage(file);
      return {
        code: 200,
        msg: '分析成功',
        data: result
      };
    } catch (error) {
      console.error('皮肤分析失败:', error);
      const message = error.message || '分析失败';
      // 根据错误类型返回更友好的提示
      if (message.includes('超时')) {
        return { code: 500, msg: 'AI 服务响应超时，请重试', data: null };
      }
      if (message.includes('JSON') || message.includes('格式异常')) {
        return { code: 500, msg: 'AI 返回格式异常，请重试', data: null };
      }
      if (message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
        return { code: 500, msg: 'AI 服务暂不可用，请稍后重试', data: null };
      }
      return { code: 500, msg: '分析失败，请重试', data: null };
    }
  }

  @Post('check-face')
  @UseInterceptors(FileInterceptor('image'))
  async checkFace(@UploadedFile() file: UploadedFileType) {
    if (!file) throw new BadRequestException('未上传图片');
    const result = await this.skinService.checkFaceAlignment(file);
    return { code: 200, msg: 'ok', data: result };
  }

  @Get('recommend')
  async recommendProducts(@Query() query: any) {
    const { skinType, moisture, oiliness, sensitivity, concerns, acne, wrinkles, spots, pores, blackheads } = query;

    const skinData = {
      skinType: skinType || '中性皮肤',
      concerns: concerns ? concerns.split(',').map((c: string) => c.trim()) : [],
      moisture: parseInt(moisture) || 70,
      oiliness: parseInt(oiliness) || 50,
      sensitivity: parseInt(sensitivity) || 30,
      acne: acne !== undefined ? parseInt(acne) : undefined,
      wrinkles: wrinkles !== undefined ? parseInt(wrinkles) : undefined,
      spots: spots !== undefined ? parseInt(spots) : undefined,
      pores: pores !== undefined ? parseInt(pores) : undefined,
      blackheads: blackheads !== undefined ? parseInt(blackheads) : undefined
    };

    try {
      const products = await this.skinService.recommendProducts(skinData);
      return {
        code: 200,
        msg: '推荐成功',
        data: products
      };
    } catch (error) {
      console.error('产品推荐失败:', error);
      throw error;
    }
  }
}
