import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async validateApiKey(apiKey: string, type: 'client' | 'bank') {
        const [id, hash] = apiKey.split('.');
        const isIdNumber = !isNaN(Number(id));
        if (!isIdNumber) throw new Error('Invalid API Key');
        const idAsNumber = Number(id);

        const apiKeyOwner =
            type === 'client'
                ? await this.prisma.client.findUnique({
                      where: { id: idAsNumber },
                      select: { id: true, apiKeyHash: true },
                  })
                : await this.prisma.bank.findUnique({
                      where: { id: idAsNumber },
                      select: { id: true, apiKeyHash: true },
                  });

        if (!apiKeyOwner) {
            throw new Error('Invalid API Key');
        }

        const isValid = await argon2.verify(
            apiKeyOwner.apiKeyHash as string,
            hash,
        );

        if (!isValid) {
            throw new Error('Invalid API Key');
        }

        return apiKeyOwner;
    }
}
