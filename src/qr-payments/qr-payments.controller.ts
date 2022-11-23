import { Body, Controller, Get, Post } from '@nestjs/common';

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
    getHello(): string {
        return 'Hello World!';
    }
}
