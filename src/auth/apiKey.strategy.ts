import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(authService: AuthService) {
        super(
            { header: 'Authorization', prefix: 'X-QRPP-Api-Key' },
            true,
            (apiKey: string, done: (isValid: boolean) => void) => {
                const checkKey = authService.validateApiKey(apiKey);
                if (!checkKey) {
                    return done(false);
                }
                return done(true);
            },
        );
    }
}
