import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import * as express from 'express';
import { HttpStatusInterceptor } from './interceptors/http-status.interceptor';

function parsePort(): number {
  // 优先读取 PORT 环境变量（最高优先级）
  if (process.env.PORT) {
    const port = parseInt(process.env.PORT, 10);
    if (!isNaN(port) && port > 0 && port < 65536) {
      console.log(`[DEBUG] Using port ${port} from PORT env var`);
      return port;
    }
  }

  // 检查命令行参数
  const args = process.argv.slice(2);
  const portIndex = args.indexOf('-p');
  if (portIndex !== -1 && args[portIndex + 1]) {
    const port = parseInt(args[portIndex + 1], 10);
    if (!isNaN(port) && port > 0 && port < 65536) {
      console.log(`[DEBUG] Using port ${port} from command line`);
      return port;
    }
  }

  // 云托管环境默认使用 80 端口
  // 如果设置了 CLOUDBASE_ENV_ID 或 NODE_ENV 为 production，则使用 80 端口
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
  const app = await NestFactory.create(AppModule);

  // NFC 重定向端点 — 注册在全局 /api 前缀之前，保持短 URL
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/nfc', (_req: any, res: any) => {
    const scheme = 'weixin://dl/business/?appid=wx8826c7b681ec3c65&path=pages/landing/index&env_version=release';
    res.send(`<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>正在打开小程序…</title>
<style>body{font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5}.card{text-align:center;background:#fff;border-radius:20px;padding:40px 30px;box-shadow:0 10px 40px rgba(0,0,0,.1);max-width:320px}.spinner{width:40px;height:40px;margin:0 auto 20px;border:3px solid #eee;border-top-color:#07c160;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}h2{color:#333;margin:0 0 8px;font-size:20px}p{color:#999;margin:0 0 24px;font-size:14px}.btn{display:block;width:100%;padding:12px;background:#07c160;color:#fff;border:none;border-radius:10px;font-size:16px;text-decoration:none;margin-bottom:10px;cursor:pointer}.btn-outline{background:#fff;color:#07c160;border:1px solid #07c160}</style>
</head>
<body>
<div class="card">
<div class="spinner"></div>
<h2>正在打开小程序</h2>
<p>智能皮肤检测</p>
<a class="btn" href="${scheme}">打开小程序</a>
<p style="font-size:12px;color:#ccc">如未自动跳转，请点击上方按钮</p>
</div>
<script>
(function(){
  var ua=navigator.userAgent.toLowerCase();
  if(ua.indexOf('micromessenger')!==-1||ua.indexOf('android')!==-1||ua.indexOf('iphone')!==-1||ua.indexOf('ipad')!==-1){
    setTimeout(function(){window.location.href='${scheme}';},300);
  }
})();
</script>
</body></html>`);
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // 全局拦截器：统一将 POST 请求的 201 状态码改为 200
  app.useGlobalInterceptors(new HttpStatusInterceptor());
  // 1. 开启优雅关闭 Hooks (关键!)
  app.enableShutdownHooks();

  // 2. 解析端口
  const port = parsePort();
  try {
    await app.listen(port);
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`🚀 Application is ready to accept connections`);
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ 端口 ${port} 被占用! 请运行 'npx kill-port ${port}' 然后重试。`);
      process.exit(1);
    } else {
      throw err;
    }
  }
}
bootstrap();
