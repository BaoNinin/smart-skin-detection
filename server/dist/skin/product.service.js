"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const coze_coding_dev_sdk_1 = require("coze-coding-dev-sdk");
let ProductService = class ProductService {
    constructor() {
        const config = new coze_coding_dev_sdk_1.Config();
        this.client = new coze_coding_dev_sdk_1.LLMClient(config);
    }
    async recommendProducts(skinData) {
        try {
            console.log('开始推荐产品...');
            const concernsText = skinData.concerns.join('、');
            const messages = [
                {
                    role: 'system',
                    content: '你是一位专业的美容护肤顾问。根据用户的皮肤状态，推荐合适的护肤产品。'
                },
                {
                    role: 'user',
                    content: `用户皮肤状态：
- 皮肤类型：${skinData.skinType}
- 皮肤问题：${concernsText || '无明显问题'}
- 水分：${skinData.moisture}%
- 油性：${skinData.oiliness}%
- 敏感度：${skinData.sensitivity}%

请推荐 3 款适合的护肤产品，按以下 JSON 格式返回（只返回 JSON 数组，不要有其他文字）：
[
  {
    "id": "产品ID",
    "name": "产品名称",
    "brand": "品牌",
    "category": "产品类别（如：洁面、保湿、精华、面膜）",
    "price": 价格（数字）,
    "description": "产品描述和使用建议",
    "image": "产品图片URL（使用 https://images.unsplash.com 的真实图片链接）",
    "rating": 评分（1-5的数字）,
    "tags": ["标签1", "标签2"]
  }
]`
                }
            ];
            const response = await this.client.invoke(messages, {
                model: 'doubao-1-5-vision-pro-32k-250115',
                temperature: 0.7
            });
            console.log('LLM 响应长度:', response.content.length);
            console.log('LLM 响应:', response.content.substring(0, 500));
            const jsonMatch = response.content.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                console.error('无法解析 LLM 响应为 JSON 数组');
                return this.getDefaultProducts(skinData);
            }
            const products = JSON.parse(jsonMatch[0]);
            return Array.isArray(products) ? products : this.getDefaultProducts(skinData);
        }
        catch (error) {
            console.error('产品推荐失败:', error);
            return this.getDefaultProducts(skinData);
        }
    }
    getDefaultProducts(skinData) {
        return [
            {
                id: '1',
                name: '温和洁面乳',
                brand: '纯净护肤',
                category: '洁面',
                price: 128,
                description: '温和清洁，不带走肌肤水分，适合日常使用',
                image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
                rating: 4.5,
                tags: ['温和', '保湿']
            },
            {
                id: '2',
                name: '深层保湿精华',
                brand: '润泽护肤',
                category: '精华',
                price: 298,
                description: '深层滋润肌肤，提升肌肤含水量，改善干燥',
                image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400',
                rating: 4.8,
                tags: ['保湿', '修护']
            },
            {
                id: '3',
                name: '舒缓修护面膜',
                brand: '舒缓护理',
                category: '面膜',
                price: 168,
                description: '舒缓肌肤，减少敏感，修护肌肤屏障',
                image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400',
                rating: 4.6,
                tags: ['舒缓', '修护']
            }
        ];
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ProductService);
//# sourceMappingURL=product.service.js.map