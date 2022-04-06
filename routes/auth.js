import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import middleware from '../middleware.js';

const rounds = 10;
const tokenSecret = 'temp-secret';
const router = express.Router();

router.get('/login', (req, res) => {
  User.findOne({email: req.body.email}).then(user => {
    if (!user) {
      res.status(404).json({error: 'no user with that email found'});
    } else {
      bcrypt.compare(req.body.password, user.password, (error, match) => {
        if (error) {
          res.status(500).json(error);
        } else if (match) {
          res.status(200).json({token: generateToken(user)});
        } else {
          res.status(403).json({error: 'passwords do not match'});
        }
      });
    }
  });
});

router.get('/jwt-test', middleware.verify, (req, res) => {
  res.status(200).json(req.user);
});

router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, rounds, (error, hash) => {
    if (error) res.status(500).json(error);
    else {
      const newUser = User({email: req.body.email, password: hash});
      newUser.save().then(user => {
        res.status(200).json({token: generateToken(user)});
      }).catch(error => {
        res.status(500).json(error);
      });
    }
  });
});

const generateToken = (user) => {
  return jwt.sign({data: user}, tokenSecret, {expiresIn: '24h'});
}

export default router;
