import { ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { ApiKeyGuard } from './ApiKeyGuard';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BankApiKeyGuard extends ApiKeyGuard {
    constructor(private authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest<
            IncomingMessage & { client?: Record<string, unknown> }
        >(context);
        try {
            const apiKey = this.getApiKey(request.headers);
            const client = await this.authService.validateApiKey(
                apiKey,
                'bank',
            );
            request.client = client;
            return true;
        } catch (e) {
            return false;
        }
    }
}
