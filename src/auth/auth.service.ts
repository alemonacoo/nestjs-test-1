import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signin() {
    return { msg: 'i am signed in' };
  }
  signup() {
    return { msg: 'i am signed up' };
  }
}
