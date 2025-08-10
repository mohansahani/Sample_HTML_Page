const router = require('express').Router();
const { login, register } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { loginValidator, registerValidator } = require('../validators/authValidators');
const { auth, requireRole } = require('../middleware/auth');

router.post('/login', loginValidator, validateRequest, login);
router.post('/register', auth, requireRole('Admin'), registerValidator, validateRequest, register);

module.exports = router;