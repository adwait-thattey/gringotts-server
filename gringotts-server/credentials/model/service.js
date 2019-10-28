const mongoose = require('mongoose');

// Services like gmail/outlook/yahoo
const serviceSchema = new mongoose.Schema({
    name: String,
    logo: String
});

module.exports = mongoose.Model('Service', serviceSchema);