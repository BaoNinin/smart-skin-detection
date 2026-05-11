import { SkinService } from './skin.service';
export declare class ProductController {
    private readonly skinService;
    constructor(skinService: SkinService);
    getRecommendations(skinType?: string, concerns?: string, moisture?: string, oiliness?: string, sensitivity?: string): Promise<{
        code: number;
        msg: string;
        data: import("./skin.types").Product[];
    }>;
}
