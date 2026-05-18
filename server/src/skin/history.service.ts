import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { getSupabaseClient } from '@/storage/database/supabase-client';

@Injectable()
export class HistoryService {
  constructor(private readonly userService: UserService) {
    console.log('HistoryService 初始化完成，使用 Supabase 数据库存储');
  }

  async getHistory(userId?: number) {
    if (!userId) {
      console.warn('历史记录查询未提供用户ID');
      return [];
    }

    const client = getSupabaseClient();
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

    return (data || []).map((r: any) => ({
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

  async saveHistory(record: {
    userId: number;
    skinType: string;
    concerns: string[];
    moisture: number;
    oiliness: number;
    sensitivity: number;
    recommendations: string[];
    imageUrl?: string;
    acne?: number;
    wrinkles?: number;
    spots?: number;
    pores?: number;
    blackheads?: number;
  }) {
    const client = getSupabaseClient();
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

  async deleteHistory(id: string) {
    const client = getSupabaseClient();
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
}
