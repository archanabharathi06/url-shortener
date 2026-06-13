const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', validate(authController.signupSchema), authController.signup);
router.post('/login', validate(authController.loginSchema), authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
