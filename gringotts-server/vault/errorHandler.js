const errors = require('./vaultErrors');

exports.handleErrorFromResponse = (res) => {
    switch( res.status) {
        case 200:
        case 201:
        case 204: return true;

        case 301: throw new errors.VaultInternalError("This URL has moved", res.body || res.data);
        case 400:
        case 405:
        case 422: throw  new errors.VaultInvalidRequestError("Invalid request", res.body || res.data, res.status);

        case 401: throw new errors.VaultIncorrectCredentialsError("Incorrect Credentials", res.body || res.data);
        case 403: throw new errors.VaultPermissionDeniedError("Permission Denied", res.body || res.data);

        case 503: throw new errors.VaultSealedError()

        case 404: throw new errors.VaultNotFoundError();

    }
};

exports.handleErrorFromError = (err) => {
    console.log(err);
    if (err.isAxiosError === true) {
        if (err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED") {
            throw new errors.VaultNotInitialized();
        }
    }
}