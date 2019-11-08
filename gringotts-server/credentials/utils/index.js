const createAWSEngine = require('./createAWSEngine');
const createKVEngine = require('./createKVEngine');
const createSSHEngine = require('./createSSHEngine');
const createUserEngines = require('./createUserEngines');

const createCredsObj = require('./createCredsObj');

module.exports = {
    createAWSEngine,
    createKVEngine,
    createSSHEngine,
    createUserEngines,
    createCredsObj
}