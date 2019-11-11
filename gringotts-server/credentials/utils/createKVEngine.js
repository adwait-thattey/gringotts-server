const config = require('../../config');

module.exports = (engineType, mountPoint) => (
    {
        name: mountPoint,
        engineType,
        categories: [],
        createdAt: new Date()
    }
)