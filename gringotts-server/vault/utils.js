const config = require('../config');
const localStorage = require('./localStorage');
const axios = require('axios');
const url = require('url');
const errorHandler = require('./errorHandler');
const errors = require('./vaultErrors');
// exports.makeVaultRequest = async (user, uri, headers, payload) => {
//
// };

exports.getToken = async (user) => {
    let res;
    try {
        res = await axios.post(
            url.resolve(config.vault.host, `auth/userpass/login/${user.username}`),
            {
                "username": user.username,
                "password": user.password
            },
            {
                validateStatus: false
            }
        )
    } catch (err) {
        errorHandler.handleErrorFromError(err);
    }

    // console.log(res);

    if( res.status === 400) {
        throw new errors.VaultIncorrectCredentialsError();
    }
    errorHandler.handleErrorFromResponse(res);

    const token = res.data.auth["client_token"];

    localStorage.storeToken(user.username, token);

    return token;
};