import { Test, TestingModule } from '@nestjs/testing';
import { ReaderController } from './reader.controller';

describe('Reader Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ReaderController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ReaderController = module.get<ReaderController>(ReaderController);
    expect(controller).toBeDefined();
  });
});
