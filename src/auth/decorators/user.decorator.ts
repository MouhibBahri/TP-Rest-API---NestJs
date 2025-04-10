import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to get user from the request
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
