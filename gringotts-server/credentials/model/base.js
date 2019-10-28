const mongoose = require('mongoose');

const baseOptions = {
    discriminatorKey: 'itemtype',
    collection: 'items'
}

const Base = mongoose.Model('Base', new mongoose.Schema({
    verboseName: { type: String, required: true },
    engineType: { type: String, enum: ["kv", "aws"] },

    // This vault URL must be stripped down coming from React and keep only the relevant part
    // localhost:8200/v1/secret/data/
    vaultUrl: { type: String, required: true },
    mountPoint: { type: String, required: true }
}, baseOptions 
));

module.exports = Base;