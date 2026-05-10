import { Injectable } from '@nestjs/common'
import { getSupabaseClient } from '../storage/database/supabase-client'
import { WechatLoginDto, PhoneNumberLoginDto, UserInfoDto, UpdateUserInfoDto } from './user.types'
import * as crypto from 'miniprogram-sm-crypto'
import * as https from 'https'

@Injectable()
export class UserService {
  private exchangeWechatCode(code: string): Promise<{ openid: string; session_key: string }> {
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
            } else {
              resolve({ openid: data.openid, session_key: data.session_key });
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', (error) => {
        console.error('调用微信 API 失败:', error);
        reject(error);
      });
    });
  }
  }

  async login(wechatLoginDto: WechatLoginDto): Promise<{ userInfo: UserInfoDto; isNewUser: boolean }> {
    const { code, userInfo } = wechatLoginDto

    // 调用微信 API 用 code 换取真实 openid
    const { openid } = await this.exchangeWechatCode(code)
    console.log('微信登录成功，openid:', openid.substring(0, 10) + '...')

    const client = getSupabaseClient()

    // 查询用户是否已存在
    const { data: existingUsers, error: queryError } = await client
      .from('users')
      .select('*')
      .eq('openid', openid)
      .limit(1)

    if (queryError) {
      console.error('查询用户失败:', queryError)
      throw queryError
    }

    let userId: number
    let isNewUser = false

    if (existingUsers && existingUsers.length > 0) {
      // 用户已存在，更新用户信息
      userId = existingUsers[0].id
      const { error: updateError } = await client
        .from('users')
        .update({
          nickname: userInfo?.nickName || existingUsers[0].nickname,
          avatar_url: userInfo?.avatarUrl || existingUsers[0].avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('更新用户失败:', updateError)
        throw updateError
      }
    } else {
      // 新用户，创建用户
      const { data: newUsers, error: insertError } = await client
        .from('users')
        .insert({
          openid,
          nickname: userInfo?.nickName || null,
          avatar_url: userInfo?.avatarUrl || null,
          detection_count: 0
        })
        .select()

      if (insertError) {
        console.error('创建用户失败:', insertError)
        throw insertError
      }

      userId = newUsers[0].id
      isNewUser = true
    }

    // 获取用户信息
    const { data: users, error: fetchError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1)

    if (fetchError || !users || users.length === 0) {
      throw new Error('获取用户信息失败')
    }

    return {
      userInfo: this.toUserInfoDto(users[0]),
      isNewUser
    }
  }

  async loginWithPhoneNumber(phoneNumberLoginDto: PhoneNumberLoginDto): Promise<{ userInfo: UserInfoDto; isNewUser: boolean }> {
    const { code, encryptedData, iv } = phoneNumberLoginDto

    const client = getSupabaseClient()

    // TODO: 调用微信接口，使用 code 换取 session_key
    // 实际需要调用微信 API 获取 session_key
    // 暂时使用 code 作为 session_key（测试环境）
    const sessionKey = code

    // 使用 session_key 解密手机号
    let phoneNumber: string
    try {
      // 使用 miniprogram-sm-crypto 解密
      const decrypted = crypto.decrypt(encryptedData, sessionKey, iv, 'aes-256-cbc')
      const phoneInfo = JSON.parse(decrypted)
      phoneNumber = phoneInfo.phoneNumber
      console.log('解密后的手机号:', phoneNumber)
    } catch (error) {
      console.error('解密手机号失败:', error)
      throw new Error('解密手机号失败')
    }

    // 查询用户是否已存在（通过手机号）
    const { data: existingUsers, error: queryError } = await client
      .from('users')
      .select('*')
      .eq('phone_number', phoneNumber)
      .limit(1)

    if (queryError) {
      console.error('查询用户失败:', queryError)
      throw queryError
    }

    let userId: number
    let isNewUser = false

    if (existingUsers && existingUsers.length > 0) {
      // 用户已存在
      userId = existingUsers[0].id
      const { error: updateError } = await client
        .from('users')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('更新用户失败:', updateError)
        throw updateError
      }
    } else {
      // 新用户，创建用户
      const { data: newUsers, error: insertError } = await client
        .from('users')
        .insert({
          phone_number: phoneNumber,
          nickname: `用户${phoneNumber.slice(-4)}`,
          detection_count: 0
        })
        .select()

      if (insertError) {
        console.error('创建用户失败:', insertError)
        throw insertError
      }

      userId = newUsers[0].id
      isNewUser = true
    }

    // 获取用户信息
    const { data: users, error: fetchError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1)

    if (fetchError || !users || users.length === 0) {
      throw new Error('获取用户信息失败')
    }

    return {
      userInfo: this.toUserInfoDto(users[0]),
      isNewUser
    }
  }

  async getUserById(userId: number): Promise<UserInfoDto> {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1)

    if (error || !data || data.length === 0) {
      throw new Error('用户不存在')
    }

    return this.toUserInfoDto(data[0])
  }

  async getUserByOpenid(openid: string): Promise<UserInfoDto> {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('openid', openid)
      .limit(1)

    if (error || !data || data.length === 0) {
      throw new Error('用户不存在')
    }

    return this.toUserInfoDto(data[0])
  }

  async updateUserInfo(userId: number, updateDto: UpdateUserInfoDto): Promise<UserInfoDto> {
    const client = getSupabaseClient()

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (updateDto.nickname !== undefined) {
      updateData.nickname = updateDto.nickname
    }
    if (updateDto.avatarUrl !== undefined) {
      updateData.avatar_url = updateDto.avatarUrl
    }
    if (updateDto.phoneNumber !== undefined) {
      updateData.phone_number = updateDto.phoneNumber
    }

    const { error } = await client
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }

    const { data, error: fetchError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1)

    if (fetchError || !data || data.length === 0) {
      throw new Error('获取更新后的用户信息失败')
    }

    return this.toUserInfoDto(data[0])
  }

  async incrementDetectionCount(userId: number): Promise<UserInfoDto> {
    const client = getSupabaseClient()

    // 先获取当前用户信息
    const { data: users, error: queryError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1)

    if (queryError || !users || users.length === 0) {
      throw new Error('用户不存在')
    }

    // 更新检测次数
    const { error: updateError } = await client
      .from('users')
      .update({
        detection_count: users[0].detection_count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      console.error('更新检测次数失败:', updateError)
      throw updateError
    }

    // 获取更新后的用户信息
    const { data: updatedUsers, error: fetchError } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1)

    if (fetchError || !updatedUsers || updatedUsers.length === 0) {
      throw new Error('获取更新后的用户信息失败')
    }

    return this.toUserInfoDto(updatedUsers[0])
  }

  private toUserInfoDto(user: any): UserInfoDto {
    return {
      id: user.id,
      openid: user.openid || null,
      phoneNumber: user.phone_number || null,
      nickname: user.nickname,
      avatarUrl: user.avatar_url,
      detectionCount: user.detection_count,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }
  }
}
