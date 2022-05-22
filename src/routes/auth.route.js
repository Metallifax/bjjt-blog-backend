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
  loginUser,
);

// test jwt passed as bearer to Authorization header
authRouter.get('/decrypt-token', middleware.verify, jwtTest);

// sign up new user via password and email credentials
authRouter.post(
  '/signup',
  emailValidator(),
  passwordValidatorSignup(),
  signupUser,
);

authRouter.get('/verify/:token', verifyUser);

export default authRouter;
