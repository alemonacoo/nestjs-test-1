import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
require('dotenv').config();

// provider per connettere DB
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // chiama la funzione della classe originale
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
}
