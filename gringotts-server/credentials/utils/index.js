const createAWSEngine = require('./createAWSEngine');
const createKVEngine = require('./createKVEngine');
const createSSHEngine = require('./createSSHEngine');

const createCredsObj = require('./createCredsObj');

module.exports = {
    createAWSEngine,
    createKVEngine,
    createSSHEngine,
    createCredsObj
}