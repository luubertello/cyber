import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

// Uso en controllers: @CurrentUser() user: User
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);