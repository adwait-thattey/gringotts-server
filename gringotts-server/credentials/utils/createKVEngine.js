const config = require('../../config');

module.exports = (verboseName, engineType, mountPoint) => (
    {
        verboseName,
        engineType,
        mountPoint,
        categories: [],
        createdAt: new Date()
    }
)