import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';

//libreria per criptare passwords
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // generare password hash
    const hash = await argon.hash(dto.password);

    // saving user in DB
    await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return { msg: 'i am signed in' };
  }
  // signin() {
  //   return { msg: 'i am signed up' };
  // }
}
