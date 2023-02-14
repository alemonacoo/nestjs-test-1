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

  // NB: utilizzo lo stesso DTO
  async signin(dto: AuthDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user non esiste -> eccezione
    if (!user) {
      throw new ForbiddenException('Wrong Credentials');
    }

    // Confronta pw -> con funzione verify da libreria di Argon 2
    const pwMatch = await argon.verify(user.hash, dto.password);

    // Se pw errata -> eccezione
    if (!pwMatch) {
      throw new ForbiddenException('Wrong Credentials');
    }

    // Se pw corretta -> send user
    // non mando password
    delete user.hash;

    return user;
  }
}
