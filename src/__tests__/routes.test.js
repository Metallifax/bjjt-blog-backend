import supertest from 'supertest';
import server from '../utils/server.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const app = server();
const validUser = {
  email: 'mail@mail.com',
  password: 'Abc8def*',
};

const sendRequest = (app, route, body, responseCode) => {
  return supertest(app)
    .post(route)
    .send(body)
    .expect('Content-Type', /json/)
    .expect(responseCode);
};

const signupRoute = '/api/auth/signup';
const signinRoute = '/api/auth/login';
const jwtTestRoute = '/api/auth/jwt-test';

describe('route tests', () => {
  let mongoServer = null;
  let con = null;

  // setup functions
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    con = await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    await con.connection.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('user signup route tests', () => {
    describe('password tests in user signup', () => {
      it('should throw 400 when only password given', async () => {
        const response = await sendRequest(
          app,
          signupRoute,
          { password: validUser.password },
          400,
        );

        expect(response.body.errors[0].msg).toBe('Email must not be empty');
      });

      it('should throw 400 on password less than char limit', async () => {
        const invalidUser = { ...validUser };
        invalidUser.password = 'A*afkd4';

        const response = await sendRequest(app, signupRoute, invalidUser, 400);

        expect(response.body.errors[1].msg).toBe(
          'Must be at least 8 characters long',
        );
      });

      it('should throw 400 when password contains only letters', async () => {
        const invalidUser = { ...validUser };
        invalidUser.password = 'badpasswordyo';

        const response = await sendRequest(app, signupRoute, invalidUser, 400);

        expect(response.body.errors[0].msg).toBe(
          'Must contain a capital letter, number and special character',
        );
      });

      it('should throw 400 when password contains only numbers', async () => {
        const invalidUser = { ...validUser };
        invalidUser.password = '12345678';

        const response = await sendRequest(app, signupRoute, invalidUser, 400);

        expect(response.body.errors[0].msg).toBe(
          'Must contain a capital letter, number and special character',
        );
      });

      // eslint-disable-next-line max-len
      it('should throw 400 when password contains only special chars', async () => {
        const invalidUser = { ...validUser };
        invalidUser.password = '!@#$%^&*';

        const response = await sendRequest(app, signupRoute, invalidUser, 400);

        expect(response.body.errors[0].msg).toBe(
          'Must contain a capital letter, number and special character',
        );
      });

      // TODO: Error formatting needs work, looks like crap and un-customizable
      // eslint-disable-next-line max-len
      it('should have a similar pattern to validator when 400 error', async () => {
        await sendRequest(app, signupRoute, { email: validUser.email }, 400);

        // eslint-disable-next-line max-len
        // expect(response.error.message).toBe('cannot POST /api/auth/signup (500)');
      });
    });

    describe('email related tests in user signup', () => {
      it('should throw 400 when only email given', async () => {
        const response = await sendRequest(
          app,
          signupRoute,
          { email: validUser.email },
          400,
        );

        expect(response.body.errors[0].msg).toBe('Password must not be empty');
      });

      // eslint-disable-next-line max-len
      it('should return an error on signup with invalid email', async () => {
        const invalidUser = { ...validUser };
        invalidUser.email = 'email';

        const response = await sendRequest(app, signupRoute, invalidUser, 400);

        expect(response.body.errors[0].msg).toBe('Must be a valid email');
      });
    });

    describe('valid signup procedures', () => {
      it('should return 200 when correctly filled out', async () => {
        await sendRequest(app, '/api/auth/signup', validUser, 200);
      });

      // eslint-disable-next-line max-len
      it('should fetch a recently added user and correctly get user object with token', async () => {
        const response = await sendRequest(app, signupRoute, validUser, 200);

        const auth = `bearer ${response.body.token}`;

        await supertest(app)
          .get(jwtTestRoute)
          .set('Authorization', auth)
          .expect(200)
          .then((res) => {
            expect(res.body.email).toBe('mail@mail.com');
          });
      });
    });
  });
  describe('user login route tests', () => {
    // eslint-disable-next-line max-len
    it('should return 200 when valid user exists and attempts to log in', async () => {
      // sign up
      await sendRequest(app, signupRoute, validUser, 200).then(() => {
        supertest(app).get(signinRoute).send(validUser).expect(200);
      });
    });

    it('should return jwt token when valid user exists and attempts to log in', async () => {
      await sendRequest(app, signupRoute, validUser, 200).then(async () => {
        await supertest(app)
          .get(signinRoute)
          .send(validUser)
          .then((res) => {
            expect(res.body.token).toBeDefined();
          });
      });
    });

    // eslint-disable-next-line max-len
    it('should return 404 when user does not exist and attempts to log in', async () => {
      // sign in
      await supertest(app)
        .get(signinRoute)
        .send(validUser)
        .expect(404)
        .then((res) => {
          expect(res.body.error).toBe('No user with that email found');
        });
    });

    // eslint-disable-next-line max-len
    it('should return an error message when email provided but not password', async () => {
      const invalidUser = { email: validUser.email, password: '' };

      await supertest(app)
        .get(signinRoute)
        .set('Accept', 'application/json')
        .send(invalidUser)
        .then((res) => {
          expect(res.body.errors[0].msg).toBe('Password must not be empty');
        });
    });

    it('should return an error message when password provided but not email', async () => {
      const invalidUser = { email: '', password: validUser.password };

      await supertest(app)
        .get(signinRoute)
        .set('Accept', 'application/json')
        .send(invalidUser)
        .then((res) => {
          expect(res.body.errors[0].msg).toBe('Email must not be empty');
        });
    });

    it('should return an error message when email provided is not valid', async () => {
      const invalidUser = { email: 'mail', password: validUser.password };

      await supertest(app)
        .get(signinRoute)
        .set('Accept', 'application/json')
        .send(invalidUser)
        .then((res) => {
          expect(res.body.errors[0].msg).toBe('Must be a valid email');
        });
    });
  });
});
