const config = require('../../config');

module.exports = (mountPoint, engineType) => (
    {
        name: mountPoint,
        engineType,
        categories: [],
        createdAt: new Date()
    }
)