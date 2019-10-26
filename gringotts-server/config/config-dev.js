var config = {};

config.env = "dev";
console.log("Running Dev Configuration");

config.port = 8000;
config.mongo = {
    "host":"127.0.0.1:27018",
    "username":"username",
    "password":"password",
    "dbname":"test"
};

config.vault = {
    "host":"127.0.0.1:8200",
    "admin-token":"vault-token"
};

config.TOKEN_SECRET="token_secret"
module.exports = config;