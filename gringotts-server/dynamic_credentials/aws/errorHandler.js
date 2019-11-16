const errors = require('./awsErrors');
const {errors:vaultErrors} = require('../../vault');

const handle4xxErrors = body => {
    const errString = body.errors[0];
    
    console.log(errString)
    substring_invalid_access_token = "InvalidClientTokenId"
    substring_invalid_secret_token = "SignatureDoesNotMatch"
    substring_access_denied = "AccessDenied"
    if(errString.includes(substring_invalid_access_token)){
        throw new errors.AWSInvalidAccessToken
    }
    else if (errString.includes(substring_invalid_secret_token)){
        throw new errors.AWSInvalidSecretToken
    }
    else if (errString.includes(substring_access_denied)){
        throw new errors.AWSAccessDenied
    }
}
exports.handleErrorFromResponse = (res) => {
    switch( res.status) {
        case 200:
        case 201:
        case 204: return true;

        case 301: throw new errors.AWSError("This URL has moved", res.body);
        case 400: handle4xxErrors(res.body);

        case 404: throw new errors.AWSInternalError();

    }
};

exports.handleErrorFromError = (err) => {

    if (err instanceof vaultErrors.VaultInvalidRequestError ) {
        console.log(err);
        handle4xxErrors(err.data)
    }
    throw err;
}