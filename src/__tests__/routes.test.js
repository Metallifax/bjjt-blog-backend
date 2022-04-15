import supertest from 'supertest';
import server from '../utils/server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const app = server();
const validUser = {
  email: 'mail@mail.com',
  password: 'Abc8def*',
};

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
    it('should throw 400 when only password given', async () => {
      const response = await supertest(app)
        .post(`/api/auth/signup`)
        .send({ password: validUser.password })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors[0].msg).toBe('Email must not be empty');
    });

    it('should throw 400 when only email given', async () => {
      const response = await supertest(app)
        .post('/api/auth/signup')
        .send({ email: validUser.email })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors[0].msg).toBe('Password must not be empty');
    });

    it('should throw 400 on password less than char limit', async () => {
      const invalidUser = { ...validUser };
      invalidUser.password = 'A*afkd4';

      const response = await supertest(app)
        .post('/api/auth/signup')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors[1].msg).toBe(
        'Must be at least 8 characters long',
      );
    });

    it('should throw 400 when password contains only letters', async () => {
      const invalidUser = { ...validUser };
      invalidUser.password = 'badpasswordyo';

      const response = await supertest(app)
        .post('/api/auth/signup')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors[0].msg).toBe(
        'Must contain a capital letter, number and special character',
      );
    });

    it('should throw 400 when password contains only numbers', async () => {
      const invalidUser = { ...validUser };
      invalidUser.password = '12345678';

      const response = await supertest(app)
        .post('/api/auth/signup')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors[0].msg).toBe(
        'Must contain a capital letter, number and special character',
      );
    });

    // eslint-disable-next-line max-len
    it('should throw 400 when password contains only special chars', async () => {
      const invalidUser = { ...validUser };
      invalidUser.password = '!@#$%^&*';

      const response = await supertest(app)
        .post('/api/auth/signup')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors[0].msg).toBe(
        'Must contain a capital letter, number and special character',
      );
    });

    // TODO: Error formatting needs work, looks like crap and un-customizable
    // eslint-disable-next-line max-len
    it('should have a similar pattern to validator when 400 error', async () => {
      await supertest(app)
        .post('/api/auth/signup')
        .send({ email: validUser.email })
        .expect('Content-Type', /json/)
        .expect(400);

      // eslint-disable-next-line max-len
      // expect(response.error.message).toBe('cannot POST /api/auth/signup (500)');
    });

    // eslint-disable-next-line max-len
    it('should return an error on signup with invalid email', async () => {
      const invalidUser = { ...validUser };
      invalidUser.email = 'email';

      const response = await supertest(app)
        .post('/api/auth/signup')
        .send(invalidUser)
        .expect(400);

      expect(response.body.errors[0].msg).toBe('Must be a valid email');
    });

    it('should return 200 when correctly filled out', async () => {
      await supertest(app)
        .post('/api/auth/signup')
        .send(validUser)
        .expect('Content-Type', /json/)
        .expect(200);
    });

    // eslint-disable-next-line max-len
    it('fetching a recently added user correctly gets the user object', async () => {
      const response = await supertest(app)
        .post('/api/auth/signup')
        .send(validUser);

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
