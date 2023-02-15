import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      // condizione che ci indica che SE passiamo dati (es. email: string)
      // ci restituisce solo QUEL dato dello user
      return request.user[data];
    }
    return request.user;
  },
);
