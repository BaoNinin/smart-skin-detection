import { UploadedFile } from '@/skin/skin.types';
export declare class CloudStorageService {
    constructor();
    uploadFile(file: UploadedFile, filePath?: string): Promise<string>;
    deleteFile(fileID: string): Promise<void>;
    getTempFileURL(fileID: string): Promise<string>;
}
