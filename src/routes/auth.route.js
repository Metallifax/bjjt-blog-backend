import express from 'express';
import middleware from '../middleware.js';
import {
  jwtTest,
  loginUser,
  signupUser,
} from '../controllers/auth.controller.js';
import { body } from 'express-validator';

const authRouter = express.Router();

// login user and get credentials
authRouter.get('/login', (req, res) => {
  loginUser(req, res);
});

// test jwt passed as bearer to Authorization header
authRouter.get('/jwt-test', middleware.verify, (req, res) => {
  jwtTest(req, res);
});

// sign up new user via password and email credentials
authRouter.post(
  '/signup',
  body('email')
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password must not be empty')
    .isStrongPassword()
    .withMessage('Must contain a capital letter, number and special character')
    .isLength({ min: 8 })
    .withMessage('Must be at least 8 characters long'),
  (req, res) => {
    signupUser(req, res);
  },
);

export default authRouter;
