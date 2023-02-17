import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

describe('App e2e', () => {
  // Creo un modulo di test che importa l'intero AppModule
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    //
    // Creo app
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // rimuove in automatico tutti i campi non richiesti
      }),
    );
  });
  afterAll(async () => {
    // chiudo app
    app.close();
  });

  it.todo('should pass');
});
