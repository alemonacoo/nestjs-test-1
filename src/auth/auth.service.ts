import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';

//libreria per criptare passwords
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generare password hash
    const hash = await argon.hash(dto.password);

    // saving user in DB
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      delete user.hash;
      return user;
    } catch (error) {
      // CATCH dell'integrity violation di "unique" per l'email
      // Se l'errore ha codice P2002 => violazione della condizione "unique"
      if (error.code == 'P2002') {
        // errore di tipo "forbidden" con messaggio credentials taken
        throw new ForbiddenException('Credentials Taken');
      }
      throw error;
    }
  }
}
// signin() {
//   return { msg: 'i am signed up' };
// }
