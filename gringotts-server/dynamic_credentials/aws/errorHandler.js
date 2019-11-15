const errors = require('./awsErrors');

exports.handleErrorFromResponse = (res) => {
    switch( res.status) {
        case 200:
        case 201:
        case 204: return true;

        case 301: throw new errors.AWSError("This URL has moved", res.body);
        case 400:{
            substring_invalid_access_token = "InvalidClientTokenId"
            substring_invalid_secret_token = "SignatureDoesNotMatch"
            substring_access_denied = "AccessDenied"
            if(res.body.includes(substring_invalid_access_token)){
                throw new errors.AWSInvalidAccessToken
            }
            else if (res.body.includes(substring_invalid_secret_token)){
                throw new errors.AWSInvalidSecretToken
            }
            else if (res.body.includes(substring_access_denied)){
                throw new errors.AWSAccessDenied
            }
                        }

        case 404: throw new errors.AWSInternalError();

    }
};

exports.handleErrorFromError = (err) => {
    throw err;
}