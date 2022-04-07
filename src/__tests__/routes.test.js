import supertest from 'supertest';
import server from '../utils/server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const app = server();

describe('route tests', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('user signup route tests', () => {
    it('should throw 500 when only password given', async () => {
      await supertest(app)
        .post(`/api/auth/signup`)
        .send({ password: 'password' })
        .expect('Content-Type', /json/)
        .expect(500);
    });

    it('should throw 500 when only email given', async () => {
      await supertest(app)
        .post('/api/auth/signup')
        .send({ email: 'mail@mail.com' })
        .expect('Content-Type', /json/)
        .expect(500);
    });

    it('should return 200 when correctly filled out', async () => {
      await supertest(app)
        .post('/api/auth/signup')
        .send({ email: 'mail@mail.com', password: 'password' })
        .expect('Content-Type', /json/)
        .expect(200);
    });

    // eslint-disable-next-line max-len
    it('fetching a recently added user correctly gets the user object', async () => {
      const email = 'mail@mail.com';
      const password = 'password';

      const response = await supertest(app)
        .post('/api/auth/signup')
        .send({ email, password });

      const auth = `bearer ${response.body.token}`;

      await supertest(app)
        .get(`/api/auth/jwt-test`)
        .set('Authorization', auth)
        .expect(200)
        .then((res) => {
          expect(res.body.email).toBe('mail@mail.com');
        });
    });
  });
});
