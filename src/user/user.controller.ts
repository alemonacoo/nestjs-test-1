import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
// Custom Guard per autorizzazione -> vedi jwt.guard.ts
// Messa a livello di tutto il controller per proteggere ogni rotta

@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    // getMe(@Req() Req: Request) -> espressione sostituita con un custom decorator @getUser
    // definito in auth/decorator/get-user.decorator.ts
    //tipo "user" fornito da prisma -> corrisponde interamente alla tabella user

    return user;
  }
  //   @Patch(){

  //   }
}
