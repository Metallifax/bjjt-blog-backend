import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/default.js';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_KEY,
  },
});

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
    } else if (!user.verified) {
      res.status(403).send([{ param: 'email', msg: 'User not verified' }]);
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

export const signupUser = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(
      errors.array().map((error) => ({
        param: error.param,
        msg: error.msg,
      })),
    );
  }

  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    return res
      .status(409)
      .send([{ param: 'email', msg: 'Email is already in use' }]);
  }

  bcrypt.hash(password, config.saltRounds, async (error, hash) => {
    try {
      // create and save the user
      const newUser = await User({ email, password: hash }).save();

      // generate a verification token with the user id
      const verificationToken = jwt.sign(
        { ID: newUser._id },
        config.tokenSecret,
        {
          expiresIn: '7d',
        },
      );

      // email the user the unique verification link
      const url = `http://localhost:${config.port}/api/auth/verify/${verificationToken}`;

      transporter.sendMail({
        from: 'mathew_forgione@msn.com',
        to: email,
        subject: 'Verify Account',
        html: `Click <a href='${url}'>here</a> to confirm your email.`,
      });

      return res
        .status(201)
        .send({ msg: `Sent a verification email to ${email}` });
    } catch (err) {
      console.log(err);
      return res.status(500).json(error);
    }
    //   res.status(200).json({ token: generateToken(user) });
  });
};

export const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(422).send({
      message: 'Missing Token',
    });
  }

  // verify token from the url
  let payload = null;
  try {
    payload = jwt.verify(token, config.tokenSecret);
  } catch (err) {
    return res.status(500).send(err);
  }

  try {
    // find user with matching ID
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({
        message: 'User does not exist',
      });
    }

    // update user verification status to true
    user.emailVerified = true;
    await user.save();

    return res.status(200).send({
      message: 'Account verified',
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

const generateToken = (user) =>
  jwt.sign({ data: user }, config.tokenSecret, { expiresIn: '24h' });
