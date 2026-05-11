"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const skin_controller_1 = require("./skin.controller");
const product_controller_1 = require("./product.controller");
const history_controller_1 = require("./history.controller");
const skin_service_1 = require("./skin.service");
const product_service_1 = require("./product.service");
const history_service_1 = require("./history.service");
const cloud_storage_service_1 = require("../config/cloud-storage.service");
const user_module_1 = require("../user/user.module");
let SkinModule = class SkinModule {
};
exports.SkinModule = SkinModule;
exports.SkinModule = SkinModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            platform_express_1.MulterModule.register({
                limits: {
                    fileSize: 10 * 1024 * 1024,
                },
                dest: '/tmp/uploads',
            }),
        ],
        controllers: [skin_controller_1.SkinController, product_controller_1.ProductController, history_controller_1.HistoryController],
        providers: [skin_service_1.SkinService, product_service_1.ProductService, history_service_1.HistoryService, cloud_storage_service_1.CloudStorageService],
    })
], SkinModule);
//# sourceMappingURL=skin.module.js.map