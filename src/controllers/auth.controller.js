import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/default.js';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

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
    logger.info(`Validation error(s) when calling \`loginUser()\`:${errors}`);
    return res.status(400).json(
      errors.array().map((error) => ({
        param: error.param,
        msg: error.msg,
      })),
    );
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      logger.info(`No user with ${req.body.email} was found`);
      res
        .status(404)
        .json([{ param: 'email', msg: 'No user with that email found' }]);
    } else if (!user.emailVerified) {
      logger.info(`User with email "${req.body.email}" is not verified`);
      res.status(403).send([{ param: 'email', msg: 'User not verified' }]);
    } else {
      bcrypt.compare(req.body.password, user.password, (error, match) => {
        if (error) {
          logger.error(`500 Server error: \n${error}`);
          res.status(500).json(error);
        } else if (match) {
          res.status(200).json({ token: generateToken(user), user });
        } else {
          logger.info(`Password is incorrect for user ${req.body.email}`);
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
    logger.info(`Validation error(s) when calling \`signupUser()\`:${errors}`);
    return res.status(400).json(
      errors.array().map((error) => ({
        param: error.param,
        msg: error.msg,
      })),
    );
  }

  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    logger.info(`Email already in use for user with email ${email}`);
    return res
      .status(409)
      .send([{ param: 'email', msg: 'Email is already in use' }]);
  }

  bcrypt.hash(password, config.saltRounds, (error, hash) => {
    // create and save the user
    new User({ email, password: hash })
      .save()
      .then((newUser) => {
        // generate a verification token with the user id
        const verificationToken = jwt.sign(
          { ID: newUser._id },
          config.tokenSecret,
          {
            expiresIn: '7d',
          },
        );

        // email the user the unique verification link
        const url = `http://localhost:3000/verify/${verificationToken}`;

        transporter.sendMail({
          from: 'mathew_forgione@msn.com',
          to: email,
          subject: 'Verify Account',
          html: `Click <a href='${url}'>here</a> to confirm your email.`,
        });

        return res
          .status(201)
          .send({ msg: `Sent a verification email to ${email}` });
      })
      .catch((err) => {
        logger.info(`Error when using the \`signUp()\` method: ${err}`);
        return res.status(500).json(error);
      });
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
    logger.info(`Error during token verification ${err}`);
    return res.status(500).send(err);
  }

  try {
    // find user with matching ID
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      logger.info(`User with id ${user._id} does not exist`);
      return res.status(404).send({
        message: 'User does not exist',
      });
    }

    // update user verification status to true
    user.emailVerified = true;
    await user.save();

    return res.status(200).send({
      message: 'Account verified',
      token: generateToken(user),
      user,
    });
  } catch (err) {
    logger.info(`when using the \`verifyUser()\` method:${err}`);
    return res.status(500).send(err);
  }
};

const generateToken = (user) =>
  jwt.sign({ data: user }, config.tokenSecret, { expiresIn: '24h' });
