const mongoose = require('mongoose');


const engineSchema = new mongoose.Schema({
    verboseName: {
        type: String,
        required: true
    },
    // KV / ssh / dyn cred
    type: {
        type: String,
        required: true
    },
    // This vault URL must be stripped down coming from React and keep only the relevant part
    // localhost:8200/v1/secret/data/
    vaultUrl: {
        type: String,
        required: true
    },
    mountPoint: {
        type: String,
        required: true
    }
});

module.exports = mongoose.Model('Engine', engineSchema);