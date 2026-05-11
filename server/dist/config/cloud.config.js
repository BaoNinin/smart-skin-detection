"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTIONS = exports.storage = exports.db = void 0;
const cloud = require('wx-server-sdk');
cloud.init({
    env: process.env.CLOUDBASE_ENV_ID || '',
    traceUser: true,
});
exports.db = cloud.database();
exports.storage = cloud.uploadFile;
exports.COLLECTIONS = {
    HISTORY: 'skin_history',
    USERS: 'users',
};
//# sourceMappingURL=cloud.config.js.map