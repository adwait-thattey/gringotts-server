const vapi = require('./vault/api');
const axios = require('axios');
const url = require('url');
const config = require('./config');
const utils = require('./vault/utils');
user = {
    "username":"sampleuser001",
    "password": "minda"
};

/*vapi.makeVaultRequest(user,"kv/eng1/another/secret2", 'get')
    .then( res=> {
        console.log(res);
    })*/
/*

vapi.createUser(user).then(()=> {
    console.log("done");
    utils.getToken(user).then(token => {
        console.log("token:-", token);
        vapi.makeVaultRequest(user, "", "", "");
    });

}).catch((err)=> {
    console.log("Error", err)
});
*/

vapi.mountNewEngine(user, "kv").then( res=> {
    console.log(res);
})
