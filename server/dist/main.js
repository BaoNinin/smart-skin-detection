"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require("express");
const http_status_interceptor_1 = require("./interceptors/http-status.interceptor");
function parsePort() {
    if (process.env.PORT) {
        const port = parseInt(process.env.PORT, 10);
        if (!isNaN(port) && port > 0 && port < 65536) {
            console.log(`[DEBUG] Using port ${port} from PORT env var`);
            return port;
        }
    }
    const args = process.argv.slice(2);
    const portIndex = args.indexOf('-p');
    if (portIndex !== -1 && args[portIndex + 1]) {
        const port = parseInt(args[portIndex + 1], 10);
        if (!isNaN(port) && port > 0 && port < 65536) {
            console.log(`[DEBUG] Using port ${port} from command line`);
            return port;
        }
    }
    console.log(`[DEBUG] CLOUDBASE_ENV_ID: ${process.env.CLOUDBASE_ENV_ID}`);
    console.log(`[DEBUG] NODE_ENV: ${process.env.NODE_ENV}`);
    if (process.env.CLOUDBASE_ENV_ID || process.env.NODE_ENV === 'production') {
        console.log('[DEBUG] Using port 80 for cloud hosting');
        return 80;
    }
    console.log('[DEBUG] Using port 3000 (default)');
    return 3000;
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalInterceptors(new http_status_interceptor_1.HttpStatusInterceptor());
    app.enableShutdownHooks();
    const port = parsePort();
    try {
        await app.listen(port);
        console.log(`✅ Server running on http://localhost:${port}`);
        console.log(`🚀 Application is ready to accept connections`);
    }
    catch (err) {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ 端口 ${port} 被占用! 请运行 'npx kill-port ${port}' 然后重试。`);
            process.exit(1);
        }
        else {
            throw err;
        }
    }
}
bootstrap();
//# sourceMappingURL=main.js.map