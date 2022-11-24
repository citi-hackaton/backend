import { PrismaClient, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const clientApiKey = '7mJuPfZsBzc3JkrANrFrcDqC';
const bankApiKey = 'UEHuh2u2OIEHoi2he221ei12';

const fakeClient = async (): Promise<Prisma.ClientCreateInput> => ({
    name: 'Fake Client',
    email: 'fake-client@example.com',
    bankAccount: '123456789',
    address: 'Fake Address',
    webhookEndpoint: 'https://example.com/webhook',
    apiKeyHash: await argon2.hash(clientApiKey),
});

const fakeBank = async (): Promise<Prisma.BankCreateInput> => ({
    name: 'Fake Bank',
    bankCode: 'bank-code',
    apiKeyHash: await argon2.hash(bankApiKey),
});

async function main() {
    console.log('Seeding...');

    await prisma.client.create({
        data: await fakeClient(),
    });

    await prisma.bank.create({
        data: await fakeBank(),
    });

    console.log('Seeding done.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
