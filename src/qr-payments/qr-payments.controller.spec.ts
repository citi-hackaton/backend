import { Test, TestingModule } from '@nestjs/testing';
import { QrPaymentsController } from './qr-payments.controller';

describe('QrPaymentsController', () => {
    let controller: QrPaymentsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QrPaymentsController],
        }).compile();

        controller = module.get<QrPaymentsController>(QrPaymentsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
