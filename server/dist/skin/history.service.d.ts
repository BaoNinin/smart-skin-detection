import { UserService } from '@/user/user.service';
export declare class HistoryService {
    private readonly userService;
    constructor(userService: UserService);
    getHistory(userId?: number): Promise<{
        id: any;
        skin_type: any;
        concerns: any;
        moisture: any;
        oiliness: any;
        sensitivity: any;
        acne: any;
        wrinkles: any;
        spots: any;
        pores: any;
        blackheads: any;
        recommendations: any;
        image_url: any;
        created_at: any;
    }[]>;
    saveHistory(record: {
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
    }): Promise<any>;
    deleteHistory(id: string): Promise<{
        success: boolean;
    }>;
}
