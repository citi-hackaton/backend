import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { QrPaymentsModule } from './qr-payments/qr-payments.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [AuthModule, QrPaymentsModule, PrismaModule],
    providers: [PrismaService],
})
export class AppModule {}
