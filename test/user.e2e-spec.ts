import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from './../src/user/user.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/user (GET)', () => {
    return request(app.getHttpServer()).get('/user').expect(200).expect([]);
  });

  it('/user(POST)', async () => {
    const createUserDto = { email: 'test@example.com', name: 'Test User' };

    const response = await request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201);
    expect(response.body).toEqual(expect.objectContaining(createUserDto));
    userId = response.body.id;
  });

  it('/user/:id (PUT)', async () => {
    const updateUserDto = { age: 29 };

    const response = await request(app.getHttpServer())
      .put(`/user/${userId}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining(updateUserDto));
  });

  it('/user/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${userId}`)
      .expect(200);

    expect(response.body).toEqual(expect.objectContaining({ id: userId }));
  });

  it('/user/:id (DELETE)', async () => {
    return request(app.getHttpServer()).delete(`/user/${userId}`).expect(200);
  });

  it('/user/:id (GET)', async () => {
    return request(app.getHttpServer()).get(`/user/${userId}`).expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
