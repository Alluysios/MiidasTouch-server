const express = require('express');
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// CHECK IF USER IS AUTHENTICATED
router.get('/', protect, authController.authenticate)

// REGISTER USER
router.post('/register', [
    // name and username must be not empty
    check('name').not().isEmpty().withMessage('name is required'),
    check('username').not().isEmpty().withMessage('username is required'),
    // email must be an email
    check('email').isEmail().withMessage('not recognize as email'),
    // password in only min of 6 char and max of 16 char
    check('password').isLength({ min: 6, max: 16 }).withMessage('Password must be at least minimum of 6 char and max of 16')
], authController.register);

// LOGIN
router.post('/login', authController.login);

module.exports = router;