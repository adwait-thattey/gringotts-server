const vault = require('../../vault');
const User = require('../../auth/model/user');
const errorHandler = require('./errorHandler');
const errors = require('./awsErrors');

const checkEngineExists = async eng_name => {

    // check if engine exists. If no, throw errors.EngineDoesNotExistError
    // get list of engines from mongo, filter all engines with type aws, then check if any engine with given name exists
    // if exists, return true
    const userInfo = await User.findOne(
        { "engines.name": eng_name ,"engines.engineType": "aws"}
    )

    console.log(userInfo);
    
    if (!userInfo) return false
    return true
}

const configureEngine = engName => {
    // aws array in user->engines schema. Check if engine with this name exists there. If not, create the object.
}



exports.configureAWSEngine = async (req, res, next) => {
    console.log('hello');
    console.log(req.user);
    const eng_name = req.params.engine_name;
    const access_key = req.body.access_key;
    const secret_key = req.body.secret_key;
    const account_name = req.body.account_name;
    if (!access_key || !secret_key || !account_name) {
        res.status(400).json({"Error":"Missing access_key, secret_key or account_name"})
        next()
    }
    const payload_data ={
        access_key,
        secret_key
    };

    var engine_check_status=await checkEngineExists(eng_name);
    engine_check_status=1;
    console.log(engine_check_status)
    if(engine_check_status){
    let vaultRes;
    try{
        vaultRes = await vault.api.makeVaultRequest(req.user, `${eng_name}/config/root`, "POST", "aws",payload_data);
    }catch(err){
        errorHandler.handleErrorFromError(err)
    }

    errorHandler.handleErrorFromResponse(vaultRes)

    res.status(201).json({"message":"Root configured successfully"});
    }
    else {
            res.status(404).json({"message":"Engine not found"});
    }
}


const policies = require('./policies');

exports.add_new_role = async (req, res) => {
    console.log(req.user);
    const eng_name = req.params.engine_name;
    const role_name = req.body.role_name;
    const payload_data ={
        "credential_type":"iam_user",
        "policy_document":JSON.stringify(policies.EC2FullAccess)
         }

         console.log(payload_data.policy_document);
        var engine_check_status=await checkEngineExists(eng_name);
        engine_check_status = 1;
        if(engine_check_status){
            let vaultRes;
            try{
                vaultRes = await vault.api.makeVaultRequest(req.user, `${eng_name}/roles/${role_name}`, "POST", "aws",payload_data);
            }catch(err){
                errorHandler.handleErrorFromError(err)
            }
        
            errorHandler.handleErrorFromResponse(vaultRes)
        
            res.status(201).json({"message":"new role created successfully"});
            }
            else {
                    res.status(404).json({"message":"Engine not found"});
            }   
    }

    exports.gen_new_user = async (req, res) => {
        console.log(req.user);
        const eng_name = req.params.engine_name;
        const role_name = req.params.role_name;

            var engine_check_status=await checkEngineExists(eng_name);
            engine_check_status = 1;
            if(engine_check_status){
                let vaultRes;
                try{
                    vaultRes = await vault.api.makeVaultRequest(req.user, `${eng_name}/creds/${role_name}`, "GET", "aws");
                }catch(err){
                    errorHandler.handleErrorFromError(err)
                }
            
                errorHandler.handleErrorFromResponse(vaultRes)
                console.log(vaultRes);
                res.status(201).json({
                    "message":"user created successfully",
                    "access_key":vaultRes.data.data.access_key,
                    "secret_key":vaultRes.data.data.secret_key,
                    "lease_duration":vaultRes.data.lease_duration
                });
                }
                else {
                        res.status(404).json({"message":"Engine not found"});
                }   
        }
    

//makeVaultRequest = async (user, uri, requestType, engineType, payload, customHeaders, appendPath=true )