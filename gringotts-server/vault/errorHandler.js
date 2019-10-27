const errors = require('./vaultErrors');

exports.handleErrorFromResponse = (res) => {
    switch( res.statusCode) {
        case 200:
        case 201:
        case 204: return true;

        case 301: throw new errors.VaultInternalError("This URL has moved", res.body);
        case 400:
        case 405:
        case 422: throw  new errors.VaultInternalError("Invalid request", res.body);

        case 401: throw new errors.VaultIncorrectCredentialsError("Incorrect Credentials", res.body);
        case 403: throw new errors.VaultPermissionDeniedError("Permission Denied", res.body);

        case 503: throw new errors.VaultSealedError()

    }
};

exports.handleErrorFromError = (err) => {
    if (err.name === "RequestError") {
        if (err.cause.code === "ETIMEDOUT" || err.cause.code === "ECONNREFUSED") {
            throw new errors.VaultNotInitialized();
        }
    }
}