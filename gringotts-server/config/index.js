var env = process.env.NODE_ENV || 'dev';
var cfg = require('./config-'+env);

module.exports = cfg;