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
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    // getMe(@Req() Req: Request) -> espressione sostituita con un custom decorator @getUser
    // definito in auth/decorator/get-user.decorator.ts
    //tipo "user" fornito da prisma -> corrisponde interamente alla tabella user

    // GetUser('email') indica l'altra possibile funzione del nostro custom decorator,
    // ovvero ritrovare uno specifico dato dello user (vedi decorator)
    console.log(email);
    return user;
  }

  //   @Patch(){

  //   }
}
