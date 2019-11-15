class AWSError extends Error {
    constructor(message, data = null) {
        super();

        this.message = message || "AWS Error Occured";
        this.name = this.constructor.name;

        this.data = data
    }
}

module.exports = {
    AWSError: AWSError
};