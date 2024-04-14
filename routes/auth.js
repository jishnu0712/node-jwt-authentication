const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/signup',[
    body('email').isEmail(),
    body('password').trim().isLength({ min: 3 }),
    body('name').trim().isLength({ min: 3 })
], authController.signupAction);

router.post('/login',[
    body('email').isEmail(),
    body('password').trim().isLength({ min: 3 })
], authController.loginAction);

module.exports = router;