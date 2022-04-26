import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { validationResult } from 'express-validator';

export const loginUser = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.status(404).json({ error: 'no user with that email found' });
    } else {
      bcrypt.compare(req.body.password, user.password, (error, match) => {
        if (error) {
          res.status(500).json(error);
        } else if (match) {
          res.status(200).json({ token: generateToken(user) });
        } else {
          res.status(403).json({ error: 'passwords do not match' });
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
    return res.status(400).json({ errors: errors.array() });
  }

  bcrypt.hash(req.body.password, config.get('saltRounds'), (error, hash) => {
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
  jwt.sign({ data: user }, config.get('tokenSecret'), { expiresIn: '24h' });
