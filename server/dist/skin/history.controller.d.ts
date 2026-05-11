import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    getHistory(userId?: string): Promise<{
        code: number;
        msg: string;
        data: {
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
        }[];
    }>;
    saveHistory(body: any): Promise<any>;
    deleteHistory(id: string): Promise<{
        code: number;
        msg: string;
        data: {
            success: boolean;
        };
    }>;
}
