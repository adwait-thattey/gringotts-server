class AWSError extends Error {
    constructor(message, data = null) {
        super();

        this.message = message || "AWS Error Occured";
        this.name = this.constructor.name;

        this.data = data
    }
}

class AWSInternalError extends AWSError {
    constructor(message, data = null) {
       
        let msg = message || "AWS Internal error occured "
        super(msg, data);
        this.status = 500;
    }
}

class AWSInvalidAccessToken extends AWSError {
    constructor(message, data=null) {
        let msg = message || "Invalid access token";
        super(msg, data);
        this.status = 400;
    }
}


class AWSInvalidSecretToken extends AWSError {
    constructor(message, data=null) {
        let msg = message || "Invalid secret token";

        super(msg, data);
        this.status = 400;
    }
}

class AWSAccessDenied extends AWSError {
    constructor(message, data=null) {
        let msg = message || "Access Denied";

        super(msg, data);
        this.status = 400;
    }
}


/*
1. Create user error
2. user delete error
3. Permission denied

In check from response, for 400 write cases that access token is invalid
*/

module.exports = {
    AWSError: AWSError,
    AWSInvalidSecretToken: AWSInvalidSecretToken,
    AWSInvalidAccessToken: AWSInvalidAccessToken,
    AWSInternalError: AWSInternalError,    
    AWSAccessDenied: AWSAccessDenied
};