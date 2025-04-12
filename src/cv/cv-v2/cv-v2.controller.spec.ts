import { Test, TestingModule } from '@nestjs/testing';
import { CvV2Controller } from './cv-v2.controller';

describe('CvV2Controller', () => {
  let controller: CvV2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvV2Controller],
    }).compile();

    controller = module.get<CvV2Controller>(CvV2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
