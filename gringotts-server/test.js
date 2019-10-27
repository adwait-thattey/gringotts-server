const vapi = require('./vault/api');

user = {
    "username":"sampleuser1"
};

vapi.createUser(user).then(()=> {
    console.log("done");
}).catch((err)=> {
    console.log("Error", err)
})