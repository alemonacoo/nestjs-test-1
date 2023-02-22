import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from 'src/user/dto';
import {
  CreateProjectDto,
  EditProjectDto,
} from 'src/project/dto';

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
    await prisma.project.deleteMany({});
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
    describe('Edit User', () => {
      it('Should edit user', () => {
        const dto: EditUserDto = {
          email: 'ale2@gmail.com',
          lastName: 'Developer',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.lastName);
      });
    });
  });

  // PROJECTS
  describe('Projects', () => {
    describe('Get NO Projects', () => {
      it('Should return NO Projects', () => {
        return pactum
          .spec()
          .get('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expectBodyContains('');
      });
    });

    // Create Projects
    describe('Create Projects', () => {
      // First Project
      it('Should Create 1st project', () => {
        const dto: CreateProjectDto = {
          name: 'Primo progetto',
          description: 'lorem ipsum',
        };
        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('projectId', 'id');
      });
      // Second Project
      it('Should Create 2nd project', () => {
        const dto2: CreateProjectDto = {
          name: 'Secondo progetto',
        };

        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto2)
          .expectStatus(201);
      });
      // Third Project
      it('Should Create 3rd project', () => {
        const dto3: CreateProjectDto = {
          name: 'Terzo progetto',
          description: 'lorem ipsum bla bla bla',
        };

        return pactum
          .spec()
          .post('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto3)
          .expectStatus(201)
          .stores('thirdProjectId', 'id');
      });
    });

    // Get projects
    describe('Get ALL Projects (3)', () => {
      it('Should return 3 projects', () => {
        return pactum
          .spec()
          .get('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expectJsonLength(3);
      });
    });

    // Get project by ID
    describe('Get Project by id', () => {
      it('Should get 1st project', () => {
        return pactum
          .spec()
          .get('/projects/{id}')
          .withPathParams('id', '$S{projectId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{projectId}');
      });
    });

    // Edit project
    describe('Edit Project by id', () => {
      it('Should Modify 1st project', () => {
        const dto: EditProjectDto = {
          name: 'NOME MODIFICATO!',
          description: 'DESCRIZIONE MODIFICATA!',
        };
        return pactum
          .spec()
          .patch('/projects/{id}')
          .withPathParams('id', '$S{projectId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.name);
      });

      //Delete project
    });

    // Delete Project
    describe('Delete Project by id', () => {
      it('Should delete 1st project', () => {
        return pactum
          .spec()
          .delete('/projects/{id}')
          .withPathParams('id', '$S{projectId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(204)
          .expectBodyContains('');
      });
      it('Should get only 2 projects left', () => {
        return pactum
          .spec()
          .get('/projects')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expectJsonLength(2);
      });
    });
  });

  // TO-DO(s)
  describe('To-Do(s)', () => {
    describe('Get 0 To-Do(s)', () => {
      it('Should get NO to-dos for project 3', () => {
        return pactum
          .spec()
          .get('/projects/{id}/todos')
          .withPathParams('id', '$S{thirdProjectId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAT}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
    describe('Create to-do', () => {});
    describe('Get to-do by id', () => {});
    describe('Edit to-do status by id', () => {});
    describe('Delete to-do by id', () => {});
  });
});
