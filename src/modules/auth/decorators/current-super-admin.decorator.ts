import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { SuperAdminAuthRequest } from '../types/auth-request.type';

export const CurrentSuperAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<SuperAdminAuthRequest>();

    return request.superAdmin;
  },
);
