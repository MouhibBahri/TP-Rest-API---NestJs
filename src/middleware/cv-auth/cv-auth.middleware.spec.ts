import { CvAuthMiddleware } from './cv-auth.middleware';

describe('CvAuthMiddleware', () => {
  it('should be defined', () => {
    expect(new CvAuthMiddleware()).toBeDefined();
  });
});
