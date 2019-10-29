class VaultError extends Error {
    constructor (message, data=null) {
        super();

        this.message = message || "Vault Error Occured";
        this.name = this.constructor.name;

        this.data = data
    }
}

class VaultInternalError extends VaultError {
    // This error is not meant to be shown to user
    constructor(message, data=null) {
        super(message || "Internal Vault Error", data)
    }
}

class VaultNotInitialized extends VaultInternalError {
    constructor(message, data=null) {
        super(message || "Vault does not exist at location or is not initialized", data)

        this.status = 500;
    }
}
class VaultSealedError extends VaultError {
    constructor(message, data=null) {
        super(message || "Vault is sealed. Unseal vault using unseal keys", data)
    }
}

class VaultUserExistsError extends VaultError {
    constructor(message, data=null) {
        super(message || "A Vault user with this identity already exists", data)

        this.status = 400;
    }
}

class VaultIncorrectCredentialsError extends VaultInternalError {
    constructor(message, data=null) {
        super(message || "Incorrect Password or user does not exist", data)

        this.status = 401;
    }
}

class VaultNotFoundError extends VaultInternalError {
    constructor(message, data=null) {
        super(message || "Requested Vault URL or Resource was not found", data);
    }
}

class VaultPermissionDeniedError extends VaultInternalError {
    constructor(message, data=null) {
        super(message || "This user does not have privileges to perform this action", data)
    }
}

module.exports = {
    VaultError: VaultError,
    VaultInternalError: VaultInternalError,
    VaultNotInitialized: VaultNotInitialized,
    VaultSealedError: VaultSealedError,
    VaultUserExistsError: VaultUserExistsError,
    VaultIncorrectCredentialsError: VaultIncorrectCredentialsError,
    VaultNotFoundError: VaultNotFoundError,
    VaultPermissionDeniedError: VaultPermissionDeniedError
};