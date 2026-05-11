import { UserService } from './user.service';
import { WechatLoginDto, PhoneNumberLoginDto, UserInfoDto, UpdateUserInfoDto } from './user.types';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    login(wechatLoginDto: WechatLoginDto): Promise<{
        code: number;
        msg: string;
        data: UserInfoDto;
    } | {
        code: number;
        msg: any;
        data: null;
    }>;
    loginWithPhone(phoneNumberLoginDto: PhoneNumberLoginDto): Promise<{
        code: number;
        msg: string;
        data: UserInfoDto;
    }>;
    getUserInfo(userId: string): Promise<{
        code: number;
        msg: string;
        data: UserInfoDto;
    }>;
    updateUserInfo(userId: string, updateDto: UpdateUserInfoDto): Promise<{
        code: number;
        msg: string;
        data: UserInfoDto;
    }>;
    incrementDetectionCount(userId: string): Promise<{
        code: number;
        msg: string;
        data: UserInfoDto;
    }>;
}
