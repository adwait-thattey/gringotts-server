const vault = require('../vault');
const User = require('../auth/model/user');
const 

exports.configureAWSEngine = () => {
    const eng_name = req.params.engine_name;
    const access_key = req.body.access_key;
    const secret_key = req.body.secret_key;
    const payload_data ={
        access_key,
        secret_key
    }
    await vault.makeVaultRequest(req.user, `/${eng_name}/configure/root`, "POST", "aws",payload_data);
}

//makeVaultRequest = async (user, uri, requestType, engineType, payload, customHeaders, appendPath=true )