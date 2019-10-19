const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    verboseName: {
        type: String,
        required: true
    },
    image: String, 
    vaultPath: {
        type: String,
        required: true
    }
});

module.exports = mongoose.Model('Category', categorySchema);