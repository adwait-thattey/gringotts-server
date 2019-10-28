const config = require('../../config');

module.exports = () => (
    {
        verboseName: "kv",
        engineType: "kv",
        vaultUrl: config.vault.host,
        mountPoint: "mount",

        categories: [
            {
                name: "email",
                verboseName: "Email Service",
                vaultPath: `${config.vault.host}/email`,
                creds: []
            },
            {
                name: "social_media",
                verboseName: "Social Media",
                vaultPath: `${config.vault.host}/social_media`,
                creds: []
            },
            {
                name: "entertainment",
                verboseName: "Entertainment",
                vaultPath: `${config.vault.host}/entertainment`,
                creds: []
            }
        ]
    }
)