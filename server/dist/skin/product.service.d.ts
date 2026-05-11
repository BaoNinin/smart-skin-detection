import { Product } from './skin.types';
export declare class ProductService {
    private client;
    constructor();
    recommendProducts(skinData: {
        skinType: string;
        concerns: string[];
        moisture: number;
        oiliness: number;
        sensitivity: number;
    }): Promise<Product[]>;
    private getDefaultProducts;
}
