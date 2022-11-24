import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export abstract class ApiKeyGuard implements CanActivate {
    abstract canActivate(context: ExecutionContext): Promise<boolean>;

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
