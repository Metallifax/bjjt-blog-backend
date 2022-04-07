import express from 'express';
import middleware from '../middleware.js';
import {
  jwtTest,
  loginUser,
  signupUser,
} from '../controllers/auth.controller.js';

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
authRouter.post('/signup', (req, res) => {
  signupUser(req, res);
});

export default authRouter;
