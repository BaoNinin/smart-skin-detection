import { UserService } from '@/user/user.service';
interface HistoryRecord {
    id: number;
    userId: number;
    skinType: string;
    concerns: string[];
    moisture: number;
    oiliness: number;
    sensitivity: number;
    acne: number;
    wrinkles: number;
    spots: number;
    pores: number;
    blackheads: number;
    recommendations: string[];
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}
export declare class HistoryService {
    private readonly userService;
    private readonly dataDir;
    private readonly historyFilePath;
    private nextId;
    constructor(userService: UserService);
    private ensureDataDir;
    private readHistoryFile;
    private writeHistoryFile;
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
    }): Promise<HistoryRecord>;
    deleteHistory(id: string): Promise<{
        success: boolean;
    }>;
}
export {};
