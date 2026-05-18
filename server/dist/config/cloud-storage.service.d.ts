import { UploadedFile } from '@/skin/skin.types';
export declare class CloudStorageService {
    constructor();
    uploadFile(file: UploadedFile, filePath?: string): Promise<string>;
    deleteFile(fileID: string): Promise<void>;
    uploadFileReturnFileID(file: UploadedFile, filePath?: string): Promise<string>;
    getTempFileURLs(fileIDs: string[]): Promise<Map<string, string>>;
    getTempFileURL(fileID: string): Promise<string>;
}
