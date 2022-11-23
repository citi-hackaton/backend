import { Test, TestingModule } from '@nestjs/testing';
import { QrPaymentsService } from './qr-payments.service';

describe('QrPaymentsService', () => {
    let service: QrPaymentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QrPaymentsService],
        }).compile();

        service = module.get<QrPaymentsService>(QrPaymentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
