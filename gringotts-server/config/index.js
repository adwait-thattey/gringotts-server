var env = process.env.NODE_ENV || 'dev';
let name = './config-'+env
var cfg = require(name.trim());

module.exports = cfg;