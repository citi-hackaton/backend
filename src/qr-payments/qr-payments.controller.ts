import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ClientApiKeyGuard } from 'src/auth/ClientApiKeyGuard';

@Controller('qrPayments')
export class QrPaymentsController {
    @Post('initializeTransaction')
    initializeTransaction(@Body() body: any) {
        // Generate QR co
    }

    @Post('validateTransaction')
    validateTransaction(@Body() body: any) {
        // Generate QR code
    }

    @Post('updateTransaction')
    updateTransaction(@Body() body: any) {
        // Generate QR code
    }

    @Get()
    @UseGuards(ClientApiKeyGuard)
    getHello(): string {
        return 'Hello World!';
    }
}
