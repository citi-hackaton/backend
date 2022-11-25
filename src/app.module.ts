import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QrPaymentsModule } from './qr-payments/qr-payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppLoggerMiddleware } from './middleware/logger/logger.middleware';

@Module({
    imports: [AuthModule, QrPaymentsModule, PrismaModule],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
