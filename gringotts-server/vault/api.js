const config = require('../config');
const rp = require('request-promise');
const url = require('url');
const errors = require('./vaultErrors');
const vaultErrorHandler = require('./errorHandler');

exports.createUser = async (user) => {
  /* User object must contain at least username and password */
    headers = {
        "Content-Type":"application/json",
        "Accept":"application/json",
        "User-Agent": "Request-Promise",
        "X-Vault-Token": config.vault.adminToken
    };
    // check if vault user already exists
    let res;
    try {
        let finuri = url.resolve(config.vault.host, `auth/userpass/users/${user.username}`);
        console.log(finuri);
        res = await rp({
            method: "GET",
            uri: finuri,
            headers: headers,
            simple: false,
            resolveWithFullResponse: true
        });

    }catch (err) {
        vaultErrorHandler.handleErrorFromError(err);
    };

    if (res.statusCode === 200) {
        throw new errors.VaultUserExistsError();
    }
    if (res.statusCode !== 404) {
        vaultErrorHandler.handleErrorFromResponse(res);
    }
    // user does not exist. Proceed
};