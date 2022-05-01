import { body } from 'express-validator';

const emailValidator = () =>
  body('email')
    .notEmpty()
    .withMessage('Email must not be empty')
    .isEmail()
    .withMessage('Must be a valid email');

const passwordValidatorSignin = () =>
  body('password').notEmpty().withMessage('Password must not be empty');

const passwordValidatorSignup = () =>
  body('password')
    .notEmpty()
    .withMessage('Password must not be empty')
    .isStrongPassword()
    .withMessage('Must contain a capital letter, number and special character')
    .isLength({ min: 8 })
    .withMessage('Must be at least 8 characters long');

export { emailValidator, passwordValidatorSignin, passwordValidatorSignup };
