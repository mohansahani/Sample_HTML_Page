const { body } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
];

const registerValidator = [
  body('name').isString().trim().notEmpty(),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  body('role').optional().isIn(['Admin', 'User'])
];

module.exports = { loginValidator, registerValidator };