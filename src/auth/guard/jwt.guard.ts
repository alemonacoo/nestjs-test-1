import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Usiamo le "Guards" per proteggere la rotta in caso di access token non valido
// Questa guardia si riferisce alla strategia con nome chiave 'jwt' (jwt.strategy.ts)
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
