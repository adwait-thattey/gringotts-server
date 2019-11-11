const config = require('../../config');

module.exports = (verboseName, engineType, mountPoint, accountName, CA_Configurations) => (
    {
        verboseName,
        engineType,
        vaultUrl: config.vault.host,
        mountPoint,
        accountName,
        CA_Configurations,
        // CA_Configurations: {
        //     ca_config_url: "<String/URL>",
        //     ca_public_key_url: "<String/URL>"
        // },
        roles : [],
        createdAt: new Date()
    }
)