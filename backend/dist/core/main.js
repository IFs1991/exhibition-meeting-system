"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("../modules/app.module");
const app_config_1 = require("../config/app-config");
const logging_middleware_1 = require("../middlewares/logging.middleware");
const rate_limiter_middleware_1 = require("../middlewares/rate-limiter.middleware");
const http_exception_filter_1 = require("../filters/http-exception.filter");
const logging_interceptor_1 = require("../interceptors/logging.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(app_config_1.AppConfig);
    app.use(new logging_middleware_1.LoggingMiddleware().use);
    app.use(new rate_limiter_middleware_1.RateLimiterMiddleware(config).use);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.enableCors({
        origin: config.corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('レセプト理由書アシスタントAPI')
        .setDescription('整骨院向けレセプト理由書作成支援システムのAPI仕様書')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = config.port || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap().catch(err => {
    console.error('Application failed to start:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map