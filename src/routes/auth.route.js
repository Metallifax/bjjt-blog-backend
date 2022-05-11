import express from 'express';
import middleware from '../middleware.js';
import {
  jwtTest,
  loginUser,
  signupUser,
  verifyUser,
} from '../controllers/auth.controller.js';
import {
  emailValidator,
  passwordValidatorSignin,
  passwordValidatorSignup,
} from '../utils/validators.js';

const authRouter = express.Router();

// login user and get credentials
authRouter.post(
  '/login',
  emailValidator(),
  passwordValidatorSignin(),
  (req, res) => {
    loginUser(req, res);
  },
);

// test jwt passed as bearer to Authorization header
authRouter.get('/jwt-test', middleware.verify, (req, res) => {
  jwtTest(req, res);
});

// sign up new user via password and email credentials
authRouter.post(
  '/signup',
  emailValidator(),
  passwordValidatorSignup(),
  (req, res) => {
    signupUser(req, res);
  },
);

authRouter.get('/verify/:token', (req, res) => {
  verifyUser(req, res);
});

export default authRouter;
