import { Module } from '@nestjs/common';
import { QrPaymentsController } from './qr-payments.controller';
import { QrPaymentsService } from './qr-payments.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [QrPaymentsController],
    providers: [QrPaymentsService],
    imports: [AuthModule, PrismaModule],
})
export class QrPaymentsModule {}
