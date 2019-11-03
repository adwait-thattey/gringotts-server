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
                vaultPath: `email`,
                creds: []
            },
            {
                name: "social_media",
                verboseName: "Social Media",
                vaultPath: `social_media`,
                creds: []
            },
            {
                name: "entertainment",
                verboseName: "Entertainment",
                vaultPath: `entertainment`,
                creds: []
            }
        ]
    }
)