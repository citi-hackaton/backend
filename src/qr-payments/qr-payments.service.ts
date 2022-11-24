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
interface TransactionReturnType {
    id: string;
    amount: number;
    description: string;
    client: {
        name: string;
        webhookEndpoint: string;
    };
}
@Injectable()
export class QrPaymentsService {
    constructor(
        private prisma: PrismaService,
        private schedulerRegistry: SchedulerRegistry,
    ) {}

    async initializeBusinessTransaction(
        transactionData: Prisma.TransactionCreateInput,
        clientId: number,
    ) {
        const currentTime = dayjs();
        const twoMinutesFromNow = currentTime
            .add(2, 'minutes')
            .add(10, 'seconds')
            .toDate();
        const transaction = await this.prisma.transaction.create({
            data: {
                amount: transactionData.amount,
                description: transactionData.description,
                isRejectable: transactionData.isRejectable,
                clientId,
                expirationDate: twoMinutesFromNow,
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
        let updatedTransaction: any;
        try {
            updatedTransaction = await this.prisma.transaction.update({
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
                    client: {
                        select: {
                            name: true,
                            webhookEndpoint: true,
                        },
                    },
                },
            });
        } catch (error) {
            throw new NotFoundException();
        }

        this.schedulerRegistry.deleteTimeout(transactionId);
        console.log('siema2');

        await axios
            .post(updatedTransaction.client.webhookEndpoint, {
                id: updatedTransaction.id,
                status: TransactionStatus.PENDING,
            })
            .catch((error) => {
                console.log(error);
            });

        return updatedTransaction;
    }

    async updateTransaction(transactionData: {
        transactionId: string;
        status: TransactionStatus;
    }) {
        const { transactionId, status } = transactionData;

        console.log({ transactionId, status });

        const transaction = await this.prisma.transaction.findUnique({
            where: {
                id: transactionId,
            },
            select: {
                id: true,
                status: true,
            },
        });

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
            .post(updateTransaction.client.webhookEndpoint, updateTransaction)
            .catch(() => {
                console.log('Error while sending webhook');
            });
    }
}
