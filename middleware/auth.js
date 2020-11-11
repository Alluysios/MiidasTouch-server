const jwt = require('jsonwebtoken');
const User = require('../models/User');

// authorization login required.
exports.protect = async(req, res, next) => {
    let token;
    // if there is a header of authorization then grab the token
    if(req.header('Authorization')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // else if(req.cookies.jwt) {
    //     token = req.cookies.jwt;
    // }
    // if there is no token return an error message
    if(!token) return res.status(401).json({ errors: [{ msg: 'You are not logged in' }]});

    try {
        // decode jwt and check if current user exist
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded._id).select('-password');

        if(!currentUser) return res.status(401).json({ errors: [{ msg: 'User belong to this token does no longer exist' }]});

        // Grant access to authenticated routes
        req.user = currentUser;
        next();
    } catch(err) {
        return res.status(401).json({ errors: [{ msg: 'Invalid token' }]});
    }
}

exports.onlyFor = (...roles) => {
    return (req, res, next) => {
        return (req.user.role.includes(...roles)) ? next() : res.status(401).json({ errors: [{ msg: 'You are not authorized to perform the action' }]});
    }
}