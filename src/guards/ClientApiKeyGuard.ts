import { ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { ApiKeyGuard } from './ApiKeyGuard';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ClientApiKeyGuard extends ApiKeyGuard {
    constructor(private authService: AuthService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest<
            IncomingMessage & {
                client?: {
                    id: number;
                    apiKeyHash: string | null;
                };
            }
        >(context);
        try {
            const apiKey = this.getApiKey(request.headers);
            const client = await this.authService.validateApiKey(
                apiKey,
                'client',
            );
            request.client = client;
            return true;
        } catch (e) {
            return false;
        }
    }
}
