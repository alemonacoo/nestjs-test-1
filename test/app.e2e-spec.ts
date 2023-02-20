import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

    // inizializza app
    await app.init();
    await app.listen(3333);

    // Svuota il Database da ogni user (e sotto-tabelle) ad ogni nuova inizializzazione
    const prisma = app.get(PrismaService);
    await prisma.user.deleteMany({});

    // Imposta url di base
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    // chiudo app
    app.close();
  });

  // TESTS
  //
  //
  // AUTH
  describe('Auth', () => {
    //
    // DTO
    const dto: AuthDto = {
      email: 'ale@gmail.com',
      password: '123',
      firstName: 'Alessandro',
    };
    //
    // SIGN-UP
    describe('Signup', () => {
      it('should sign-up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should throw e. if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw e. if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw e. if password, email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
    });
    //
    // SIGN-IN
    describe('Signing', () => {
      it('Should sign-in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAT', 'access_token');
      });
      it('Should throw e. if wrong credentials', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'dontexist@gmail.com',
            password: 'dontexist',
          })
          .expectStatus(403);
      });
    });
  });

  // USER
  describe('User', () => {
    describe('Get Current User', () => {
      it('Should get current User', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit User', () => {});
    describe('Edit User', () => {});
  });

  // Projects
  describe('Projects', () => {
    describe('Get Projects', () => {});
    describe('Create Project', () => {});
    describe('Get Project by id', () => {});
    describe('Edit Project by id', () => {});
    describe('Delete Project by id', () => {});
  });

  // Todo(s)
  describe('To-Do(s)', () => {
    describe('Get Projects', () => {});
    describe('Create to-do', () => {});
    describe('Get to-do by id', () => {});
    describe('Edit to-do status by id', () => {});
    describe('Delete to-do by id', () => {});
  });
});
