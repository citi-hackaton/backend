import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QrPaymentsModule } from './qr-payments/qr-payments.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [AuthModule, QrPaymentsModule, PrismaModule],
    providers: [],
})
export class AppModule {}
