const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.addProfileImage = async(req, res) => {
    if(req.file) {
        req.body.profileImage = req.file.filename;
        const user = await User.findByIdAndUpdate(req.user.id, {
            profileImage: req.body.profileImage
        }, { new: true });

        return res.json({ 
            profileImage: user.profileImage
         });
    } else {
        return res.status(400).json({ errors: [{ msg: 'Invalid file. Please use a jpeg format' }]});
    }
}

exports.updateProfile = async(req, res) => {
    const { name, username, email } = req.body;
    if(
        req.user.name === name &&
        req.user.username === username &&
        req.user.email === email
    ) {
        return res.status(400).json({ errors: [{ msg: 'Nothing to update' }]});
    }

    const user = await User.findByIdAndUpdate(req.user.id, {
        name,
        username,
        email
    }, { new: true, runValidators: true });

    res.status(201).json({
        name: user.name,
        username: user.username,
        email: user.email
    });
}

exports.changePassword = async(req, res) => {
    const { newPassword, passwordConfirm, currentPassword } = req.body;

    const user = await User.findById(req.user.id);

    // check if current password is correct
    if(!newPassword || !await bcrypt.compare(currentPassword, user.password)) {
        return res.status(400).json({ errors: [{ msg: 'Current password is wrong' }] })
    }
    
    // check if confirm password is correct
    if(newPassword !== passwordConfirm) {
        return res.status(400).json({ errors: [{ msg: 'Password not same' }]});
    }

    user.password = newPassword;
    await user.save();
    // remove password from user
    user.password = undefined;

    res.status(201).json({
        user
    })
}