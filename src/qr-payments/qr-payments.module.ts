import { Module } from '@nestjs/common';
import { QrPaymentsController } from './qr-payments.controller';
import { QrPaymentsService } from './qr-payments.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    controllers: [QrPaymentsController],
    providers: [QrPaymentsService],
    imports: [AuthModule, PrismaModule, ScheduleModule.forRoot()],
})
export class QrPaymentsModule {}
