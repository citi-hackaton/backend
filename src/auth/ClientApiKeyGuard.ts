import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { AuthService } from './auth.service';

@Injectable()
export class ClientApiKeyGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest<
            IncomingMessage & { client?: Record<string, unknown> }
        >(context);
        try {
            const apiKey = this.getApiKey(request.headers);
            const client = await this.authService.validateApiKey(apiKey);
            request.client = client;
            return true;
        } catch (e) {
            return false;
        }
    }

    protected getRequest<T>(context: ExecutionContext): T {
        return context.switchToHttp().getRequest();
    }

    protected getApiKey(headers: IncomingHttpHeaders): string {
        const authorization = headers.authorization;
        if (!authorization || Array.isArray(authorization)) {
            throw new Error('Invalid Authorization Header');
        }
        const [type, apiKey] = authorization.split(' ');
        if (type !== 'X-QRPP-Api-Key') {
            throw new Error('Invalid Authorization Header');
        }
        return apiKey;
    }
}
