import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { SetupApp } from '../src/setup-app';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    SetupApp(app);
    await app.init();
  });

  it('should signup user', () => {
    const credentials = { email: 'test@e2e.com', password: 'Test@123' };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(credentials)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(credentials.email);
      });
  });
});
