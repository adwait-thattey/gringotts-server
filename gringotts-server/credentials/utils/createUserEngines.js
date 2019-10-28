const createKVEngine = require('./createKVEngine');
const createAWSEngine = require('./createAWSEngine');
const createSSHEngine = require('./createSSHEngine');

module.exports = () => {
    const engines = [];

    // Create KV engine
    engines.push(createKVEngine());
    engines.push(createAWSEngine());
    engines.push(createSSHEngine());

    return engines;
};