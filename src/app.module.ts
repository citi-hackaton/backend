import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QrPaymentsModule } from './qr-payments/qr-payments.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
    imports: [AuthModule, QrPaymentsModule],
    providers: [PrismaService],
})
export class AppModule {}
