import { UploadedFile, SkinAnalysisResult } from './skin.types';
import { ProductService } from './product.service';
import { HistoryService } from './history.service';
import { CloudStorageService } from '@/config/cloud-storage.service';
export declare class SkinService {
    private readonly productService;
    private readonly historyService;
    private readonly cloudStorageService;
    private httpsPost;
    constructor(productService: ProductService, historyService: HistoryService, cloudStorageService: CloudStorageService);
    analyzeSkinImage(file: UploadedFile): Promise<SkinAnalysisResult>;
    uploadAnalysisImage(file: UploadedFile): Promise<string | null>;
    private sleep;
    private getMockAnalysisResult;
    checkFaceAlignment(file: UploadedFile): Promise<{
        hasFace: boolean;
        aligned: boolean;
        direction: string;
    }>;
    recommendProducts(skinData: {
        skinType: string;
        concerns: string[];
        moisture: number;
        oiliness: number;
        sensitivity: number;
    }): Promise<import("./skin.types").Product[]>;
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
}
