import { WechatLoginDto, PhoneNumberLoginDto, UserInfoDto, UpdateUserInfoDto } from './user.types';
export declare class UserService {
    private exchangeWechatCode;
    login(wechatLoginDto: WechatLoginDto): Promise<{
        userInfo: UserInfoDto;
        isNewUser: boolean;
    }>;
    loginWithPhoneNumber(phoneNumberLoginDto: PhoneNumberLoginDto): Promise<{
        userInfo: UserInfoDto;
        isNewUser: boolean;
    }>;
    getUserById(userId: number): Promise<UserInfoDto>;
    getUserByOpenid(openid: string): Promise<UserInfoDto>;
    updateUserInfo(userId: number, updateDto: UpdateUserInfoDto): Promise<UserInfoDto>;
    incrementDetectionCount(userId: number): Promise<UserInfoDto>;
    private toUserInfoDto;
}
