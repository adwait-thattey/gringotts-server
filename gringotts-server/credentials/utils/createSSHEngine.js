const config = require('../../config');

module.exports = (verboseName, engineType, mountPoint, accountName, CA_Configurations) => (
    {
        name: mountPoint,
        engineType,
        vaultUrl: config.vault.host,
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