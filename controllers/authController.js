const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrpyt = require('bcryptjs');
const { validationResult } = require('express-validator');

const signToken = (user, statusCode, res) => {
    // Get user id
    const { _id } = user;

    // JWT Sign for token
    const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Set cookie options
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 25 * 60 * 60 * 1000),
        httpOnly: true
    }

    // cookie will send encrypt version (only in https)
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    // Set cookie jwt (additional security)
    res.cookie('jwt', token, cookieOptions);

    // Remove password from the output
    user.password = undefined;

    // Return JSON
    res.status(statusCode).json({
        token,
        user
    });
}

exports.authenticate = (req, res) => {
    res.status(200).json({
        user: req.user
    })
}

exports.register = async(req, res) => {
    const errors = validationResult(req);
    // Check if user exist and return error msg if it does
    const checkUser = await User.findOne({ email: req.body.email });
    if(checkUser) return res.status(400).json({ errors: [{ msg: 'Email already exist' }]});
    // Sign Up User
    const { name, username, email, password, passwordConfirm } = req.body;

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        if(password !== passwordConfirm) return res.status(400).json({  errors: [{ msg: 'Password not same' }]});
        const user = await User.create({
            name,
            username,
            email,
            password
        });

        // sign token
        signToken(user, 201, res);
    }
};

exports.login = async(req, res) => {
    const { username, password } = req.body;
    // check if email and password exists
    if(!username || !password) return res.status(400).json({ errors: [{ msg: 'Incorrect email or password' }]});

    // check if user exist and password is correct
    const user = await User.findOne({ username }).select('+password');
    if(!user) {
        return res.status(401).json({ errors: [{ msg: 'Incorrect username or password' }] });
    }
    if(!user || !await bcrpyt.compare(password, user.password)) return res.status(400).json({ errors: [{ msg: 'Incorrect username or password' }]});
    // send token
    signToken(user, 200, res);
}

exports.logout = async(req, res, next) => {
    delete req.header('Authorization');
    res.cookie('jwt', 'im done logging out!!!');
    res.status(200).json()
}