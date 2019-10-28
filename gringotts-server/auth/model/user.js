const mongoose = require('mongoose');
const engineSchema = require('../../credentials/model/engine');

const userSchema = new mongoose.Schema({
    name: {
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
    phone_number: {
        type: String,
        required: true
    },
    is_superuser: {
        type: Boolean,
        required: true
    },
    profile_picture: String,
    engines: [engineSchema]
})

module.exports = mongoose.model('User', userSchema);