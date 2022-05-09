import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/default.js';
import { validationResult } from 'express-validator';

export const loginUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errors.array().map((error) => ({
        param: error.param,
        msg: error.msg,
      })),
    );
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res
        .status(404)
        .json([{ param: 'email', msg: 'No user with that email found' }]);
    } else {
      bcrypt.compare(req.body.password, user.password, (error, match) => {
        if (error) {
          res.status(500).json(error);
        } else if (match) {
          res.status(200).json({ token: generateToken(user) });
        } else {
          res
            .status(403)
            .json([{ param: 'password', msg: 'password is incorrect' }]);
        }
      });
    }
  });
};

export const jwtTest = (req, res) => {
  res.status(200).json(req.user);
};

export const signupUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errors.array().map((error) => ({
        param: error.param,
        msg: error.msg,
      })),
    );
  }

  bcrypt.hash(req.body.password, config.saltRounds, (error, hash) => {
    if (error) res.status(500).json(error);
    else {
      const newUser = User({ email: req.body.email, password: hash });
      newUser
        .save()
        .then((user) => {
          res.status(200).json({ token: generateToken(user) });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  });
};

const generateToken = (user) =>
  jwt.sign({ data: user }, config.tokenSecret, { expiresIn: '24h' });
