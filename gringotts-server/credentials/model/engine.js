// ! Only kv & aws mentioned as enum types
const mongoose = require('mongoose');
const Base = require('./base');

const kvSchema = Base.discriminator('kv', new mongoose.Schema({
    categories: [
        // For email
        // _id: ,
        {
            name: {
                type: String,
                required: true
            },
            verboseName: {
                type: String,
                required: true
            },
            vaultPath: {
                type: URL,
                required: true
            },
            creds: [
                {
                    // _id: ,
                    serviceId: {
                        type: mongoose.Types.ObjectId,
                        ref: 'Service'
                    },
                    vaultPath: {
                        type: URL,
                        required: true
                    },
                    email: {
                        type: String,
                        required: true
                    },
                    vaultKey: {
                        type: String,
                        required: true
                    }
                }
            ]
        }
    ]
}))

const awsSchema = Base.discriminator('aws', new mongoose.Schema({
    accountName: {
        type: String,
        required: true
    },
    roles: [
        {
            // _id,
            verboseName: {
                type: String,
                required: true
            },
            path: {
                type: URL,
                required: true
            },
            generatedCredentials: [
                {
                    // _id,
                    status: {
                        type: Boolean,
                        required: true
                    },
                    credPath: {
                        type: String,
                        required: true
                    },
                    generatedOn: {
                        type: Date,
                        required: true
                    },
                    expiresOn: {
                        type: Date,
                        required: true
                    }
                }
            ]
        }
    ]
}))


exports.kvSchema = kvSchema;
exports.awsSchema = awsSchema;