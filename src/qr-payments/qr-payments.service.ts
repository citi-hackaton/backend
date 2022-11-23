import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QrPaymentsService {
    constructor(private prisma: PrismaService) {}

    async initializeBusinessTransaction(data: any) {
        // Create a transaction using the data

        const { clientId, amount, transactionDescription } = data;

        // Get client data from db using client id
        // USE PRISMA HERE

        // Generate transaction ID TODO
        const twoMinutes = 2 * 60 * 1000;
        const transaction = await this.prisma.transaction.create({
            data: {
                amount,
                description: transactionDescription,
                clientId,
                expirationDate: new Date(new Date().getTime() + twoMinutes),
                rejectability: true,
            },
        });
        const transactionId = transaction.id;

        // Insert transaction into db
        // USE PRISMA HERE
        // transactionId
        // client id
        // amount
        // date
        // expiration date
        // transaction description
        // rejectability
        // status (initial)

        // Return the generated transaction id
        return transactionId;
    }

    validateTransaction(data: any) {
        // Validate transaction data

        const { transactionId } = data;

        // Get transaction data from db using transaction id
        const transactionData = {
            transactionId,
            // so on
        };
        // USE PRISMA HERE

        // If transaction is valid, set transaction status to 'pending'
        // USE PRISMA HERE

        // Return transaction data
        return transactionData;
    }

    updateTransaction(data: any) {
        // Set transaction status based on action

        const { transactionId, action } = data;

        // Get webhook data from db using transaction id
        const webhookEndpoint = 'https://webhook.site/1234567890';
        // USE PRISMA HERE

        // Set transaction status based on action
        switch (action) {
            case 'confirm':
                // Set transaction status to 'accepted'
                // USE PRISMA HERE
                break;
            case 'reject':
                // Set transaction status to 'rejected'
                // USE PRISMA HERE
                break;
            default:
                break;
        }

        // Send webhook to webhook endpoint
        // USE AXIOS HERE
    }
}
