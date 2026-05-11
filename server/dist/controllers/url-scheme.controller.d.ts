import { ConfigService } from '@nestjs/config';
export declare class URLSchemeController {
    private readonly configService;
    private readonly accessToken;
    constructor(configService: ConfigService);
    generateURLScheme(body: {
        path?: string;
        query?: Record<string, any>;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            openlink: any;
            expiresIn: number;
            path: string;
            query: Record<string, any>;
        };
    } | {
        code: number;
        msg: any;
        data: null;
    }>;
    generateNFCData(body: {
        deviceId?: string;
        page?: string;
        action?: 'open' | 'analyze';
    }): Promise<{
        code: number;
        msg: string;
        data: {
            urlScheme: any;
            nfcDataFormat: string;
            customData: string;
            customDataFormat: string;
            recommended: string;
            recommendedFormat: string;
        };
    } | {
        code: number;
        msg: any;
        data: null;
    }>;
    private getAccessToken;
    private buildQuery;
}
