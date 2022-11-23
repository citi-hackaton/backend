import { Module } from '@nestjs/common';
import { QrPaymentsController } from './qr-payments.controller';
import { QrPaymentsService } from './qr-payments.service';

@Module({
    controllers: [QrPaymentsController],
    providers: [QrPaymentsService],
})
export class QrPaymentsModule {}
