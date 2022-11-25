import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, TransactionStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import axios from 'axios';

@Injectable()
export class QrPaymentsService {
    constructor(
        private prisma: PrismaService,
        private schedulerRegistry: SchedulerRegistry,
    ) {}

    async initializeBusinessTransaction(
        {
            amount,
            description,
            isRejectable,
            expirationDate,
        }: Prisma.TransactionCreateInput,
        clientId: number,
    ) {
        const currentTime = dayjs();
        const twoMinutesFromNow = currentTime
            .add(2, 'minutes')
            .add(10, 'seconds')
            .toDate();
        const transaction = await this.prisma.transaction.create({
            data: {
                amount,
                description,
                isRejectable,
                clientId,
                expirationDate: isRejectable
                    ? twoMinutesFromNow
                    : expirationDate,
            },
            select: {
                id: true,
            },
        });

        const timeOutCallback = async () => {
            await this.prisma.transaction.update({
                where: {
                    id: transaction.id,
                },
                data: {
                    status: 'TIMED_OUT',
                },
            });
        };

        const timeOut = setTimeout(
            timeOutCallback,
            twoMinutesFromNow.getTime() - Date.now(),
        );
        this.schedulerRegistry.addTimeout(transaction.id, timeOut);

        return {
            transactionId: transaction.id,
        };
    }

    async validateTransaction(transactionId: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                id: transactionId,
            },
            select: {
                status: true,
            },
        });
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        if (transaction?.status !== 'INITIAL') {
            throw new BadRequestException("Transaction isn't initial");
        }

        const updatedTransaction = await this.prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: {
                status: 'PENDING',
            },
            select: {
                id: true,
                amount: true,
                description: true,
                isRejectable: true,
                client: {
                    select: {
                        id: true,
                        name: true,
                        bankAccount: true,
                        address: true,
                        webhookEndpoint: true,
                    },
                },
                status: true,
            },
        });

        if (!updatedTransaction.isRejectable) {
            this.schedulerRegistry.deleteTimeout(transactionId);
        }

        await axios
            .post(updatedTransaction.client.webhookEndpoint, {
                id: updatedTransaction.id,
                status: TransactionStatus.PENDING,
            })
            .catch((error) => {
                console.log(error);
            });

        return {
            transactionData: {
                amount: updatedTransaction.amount,
                description: updatedTransaction.description,
                clientId: updatedTransaction.client.id,
                clientName: updatedTransaction.client.name,
                bankAccount: updatedTransaction.client.bankAccount,
                address: updatedTransaction.client.address,
                status: updatedTransaction.status,
            },
        };
    }

    async updateTransaction(transactionData: {
        transactionId: string;
        status: TransactionStatus;
    }) {
        const { transactionId, status } = transactionData;

        const transaction = await this.prisma.transaction.findUnique({
            where: {
                id: transactionId,
            },
            select: {
                id: true,
                status: true,
                isRejectable: true,
            },
        });

        if (status !== 'ACCEPTED' && !transaction?.isRejectable) {
            throw new BadRequestException('Transaction is not rejectable');
        }

        if (transaction?.status !== 'PENDING') {
            throw new BadRequestException("Transaction isn't pending");
        }

        const updateTransaction = await this.prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: {
                status,
            },
            select: {
                id: true,
                status: true,
                client: {
                    select: {
                        webhookEndpoint: true,
                    },
                },
            },
        });

        await axios
            .post(updateTransaction.client.webhookEndpoint, {
                transactionId: updateTransaction.id,
                status: updateTransaction.status,
            })
            .catch(() => {
                console.log('Error while sending webhook');
            });

        return {
            status: 'OK',
        };
    }
}
