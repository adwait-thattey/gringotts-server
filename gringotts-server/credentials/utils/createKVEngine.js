const config = require('../../config');

module.exports = (verboseName, engineType, mountPoint) => (
    {
        verboseName,
        engineType,
        mountPoint,

        categories: [
            {
                name: "email",
                verboseName: "Email Service",
                creds: []
            },
            {
                name: "social_media",
                verboseName: "Social Media",
                creds: []
            },
            {
                name: "entertainment",
                verboseName: "Entertainment",
                creds: []
            }
        ]
    }
)