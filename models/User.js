const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 16
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 16
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'subscriber', 'admin']
    },
    contact: String,
    messenger: String,
    profileImage: String,
    userLocation: {
       type: { 
           type: String,
           default: 'Point',
           enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    pickupLocations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        }
    ],
});

userSchema.pre('save', async function(next) {
    // Run if password is modified
    if(!this.isModified('password')) return next;
    // Hash the password cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;