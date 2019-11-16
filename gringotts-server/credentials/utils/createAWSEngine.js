const config = require('../../config');

module.exports = (engineName, engineType) => (
    {
        name: engineName,
        engineType,
        createdAt: new Date(),
        roles : [],
    }
)