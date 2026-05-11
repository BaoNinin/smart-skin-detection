import { SkinService } from './skin.service';
import { UploadedFile as UploadedFileType } from './skin.types';
export declare class SkinController {
    private readonly skinService;
    constructor(skinService: SkinService);
    analyzeSkin(file: UploadedFileType, userId?: string): Promise<{
        code: number;
        msg: string;
        data: import("./skin.types").SkinAnalysisResult;
    }>;
    checkFace(file: UploadedFileType): Promise<{
        code: number;
        msg: string;
        data: {
            hasFace: boolean;
            aligned: boolean;
            direction: string;
        };
    }>;
    recommendProducts(query: any): Promise<{
        code: number;
        msg: string;
        data: import("./skin.types").Product[];
    }>;
}
