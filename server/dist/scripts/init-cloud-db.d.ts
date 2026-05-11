declare const cloud: any;
declare const db: any;
declare const COLLECTIONS: {
    USERS: string;
    HISTORY: string;
    HEALTH_CHECK: string;
};
declare function createTestUser(): Promise<any>;
declare function createTestHistory(userId: string): Promise<any>;
declare function createHealthCheck(): Promise<any>;
declare function checkCollectionExists(collectionName: string): Promise<boolean>;
declare function main(): Promise<void>;
