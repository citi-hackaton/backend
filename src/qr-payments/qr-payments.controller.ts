import {
    Body,
    Controller,
    HttpCode,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Prisma, TransactionStatus } from '@prisma/client';
import { BankApiKeyGuard } from 'src/guards/BankApiKeyGuard';
import { ClientApiKeyGuard } from 'src/guards/ClientApiKeyGuard';
import { QrPaymentsService } from './qr-payments.service';

@Controller('qrPayments')
export class QrPaymentsController {
    constructor(private qrPaymentsService: QrPaymentsService) {}

    @Post('initializeBusinessTransaction')
    @UseGuards(ClientApiKeyGuard)
    @HttpCode(200)
    initializeBusinessTransaction(
        @Body()
        { transactionData }: { transactionData: Prisma.TransactionCreateInput },
        @Req()
        request: Request & {
            client: {
                id: number;
                apiKeyHash: string | null;
            };
        },
    ) {
        const { client } = request;
        return this.qrPaymentsService.initializeBusinessTransaction(
            transactionData,
            client.id,
        );
    }

    // @Post('initializeBusinessTransaction')
    // @UseGuards(BankApiKeyGuard)
    // @HttpCode(200)
    // initializePersonalTransaction(
    //     @Body() transactionData: Prisma.TransactionCreateInput,
    // ) {
    // return this.qrPaymentsService.initializeBusinessTransaction(
    //     transactionData,
    // );
    // }

    @Post('validateTransaction')
    @UseGuards(BankApiKeyGuard)
    @HttpCode(200)
    validateTransaction(@Body() { transactionId }: { transactionId: string }) {
        return this.qrPaymentsService.validateTransaction(transactionId);
    }

    @Post('updateTransactionStatus')
    @UseGuards(BankApiKeyGuard)
    @HttpCode(200)
    updateTransaction(
        @Body()
        transactionData: {
            transactionId: string;
            status: TransactionStatus;
        },
    ) {
        return this.qrPaymentsService.updateTransaction(transactionData);
    }
}
