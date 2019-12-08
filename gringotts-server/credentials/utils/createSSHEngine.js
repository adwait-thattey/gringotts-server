const config = require('../../config');

module.exports = (verboseName, engineType, mountPoint) => (
    {
        name: mountPoint,
        status: 0,
        engineType: engineType,
        vaultUrl: config.vault.host,
        roles: [],
        createdAt: new Date()
    }
)