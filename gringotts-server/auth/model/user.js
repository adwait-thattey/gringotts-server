const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 511
    },
    date: {
        type: Date,
        default: Date.now
    },
    phone_number: String,
    is_superuser: {
        type: Boolean,
        required: true
    },
    profile_picture: String,
    engines: []
})

module.exports = mongoose.model('User', userSchema);