const config = require('../../config');

module.exports = () => (
    {
        verboseName: "aws",
        engineType: "aws",
        vaultUrl: config.vault.host,
        mountPoint: "mount",
        accountName: "",
    
        roles : []
    }
)