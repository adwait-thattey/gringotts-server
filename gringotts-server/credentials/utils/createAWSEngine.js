const config = require('../../config');

module.exports = (verboseName, engineType, mountPoint, accountName) => (
    {
        verboseName,
        engineType,
        mountPoint,
        accountName,
        createdAt: new Date(),
        roles : [],
    }
)