const routes = require('./routes');
const errors = require('./awsErrors');
const errorHandlers = require('./errorHandler');

module.exports = {
    routes:routes,
    errors:errors,
    errorHandlers:errorHandlers
};