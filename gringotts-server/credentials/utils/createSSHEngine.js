const config = require('../../config');

module.exports = () => (
    {
        verboseName: "ssh",
        engineType: "ssh",
        vaultUrl: config.vault.host,
        mountPoint: "mount",
        accountName: "",
    
        CA_Configurations: {
            ca_config_url: "<String/URL>",
            ca_public_key_url: "<String/URL>"
        },
        roles : []
    }
)