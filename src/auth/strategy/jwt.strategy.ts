import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

// Classe adibita alla "strategia" con la quale validare l'access token
// Questa strategia ci serve per consentire l'accesso a determinate rotte solo se autorizzati
// Vedi "user.controller.ts" per implementazione
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // 'jwt' è la chiave identificativa di default delle strategie
  // (non è necessario indicarla a meno che non la si voglia diversa)
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // funzione per "validare" i dati e trasmetterli secondo le conizioni indicate nel constructor della classe
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hash;
    return user;
  }
}
