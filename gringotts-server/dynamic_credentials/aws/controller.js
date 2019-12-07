const vault = require('../../vault');
const User = require('../../auth/model/user');
const errorHandler = require('./errorHandler');
const errors = require('./awsErrors');
const mongoose = require('mongoose');
const policies = require('./policies');

const checkEngineExists = async eng_name => {
    const userInfo = await User.findOne(
        { "engines.name": eng_name, "engines.engineType": "aws" }
    )
    if (!userInfo) return false
    return true
}

exports.configureAWSEngine = async (req, res) => {

    const engName = req.params.engine_name;

    const accessKey = req.body.accessKey;
    const secretKey = req.body.secretKey;
    const accountName = req.body.accountName;

    if (!accessKey || !secretKey || !accountName) {
        return res.status(400).json({ "Error": "Missing access_key, secret_key or account_name" })
    }

    const payload_data = {
        "access_key": accessKey,
        "secret_key": secretKey
    };

    var engine_check_status = await checkEngineExists(engName);

    if (engine_check_status) {
        let vaultRes;
        try {
            vaultRes = await vault.api.makeVaultRequest(req.user, `${engName}/config/root`, "POST", "aws", payload_data);

            await User.updateOne(
                { _id: req.user._id, "engines.name": engName },
                { $set: { "engines.$.accountName": accountName, "engines.$.flag": 1 } }
            )

        } catch (err) {
            errorHandler.handleErrorFromError(err)
        }

        errorHandler.handleErrorFromResponse(vaultRes)

        res.status(201).json({ "message": "Root configured successfully" });
    }
    else {
        res.status(404).json({ "message": "Engine not found" });
    }
}


exports.addNewRole = async (req, res) => {

    const engineName = req.params.engine_name;
    const roleName = req.body.roleName;

    const payload_data = {
        "credential_type": "iam_user",
        "policy_document": JSON.stringify(policies.EC2FullAccess)
    }

    var engine_check_status = await checkEngineExists(engineName);

    if (engine_check_status) {
        let vaultRes;
        try {
            vaultRes = await vault.api.makeVaultRequest(req.user, `${engineName}/roles/${roleName}`, "POST", "aws", payload_data);

            const dataObj = {
                _id: mongoose.Types.ObjectId(),
                roleName,
                generatedCreds: []
            }
            await User.updateOne(
                { _id: req.user._id, "engines.name": engineName },
                {
                    $push: { "engines.$.roles": dataObj },
                    "engines.$.flag": 2
                }
            )
        } catch (err) {
            errorHandler.handleErrorFromError(err)
        }

        // errorHandler.handleErrorFromResponse(vaultRes)
        res.status(201).json({ "message": "new role created successfully" });
    }
    else {
        res.status(404).json({ "message": "Engine not found" });
    }
}

exports.genNewUser = async (req, res) => {

    const engineName = req.params.engine_name;
    const roleName = req.params.role_name;

    const engine_check_status = await checkEngineExists(engineName);

    if (engine_check_status) {
        let vaultRes;
        try {
            vaultRes = await vault.api.makeVaultRequest(req.user, `${engineName}/creds/${roleName}`, "GET", "aws");
        
            const credObj = {
                _id: mongoose.Types.ObjectId(),
                accessKey: vaultRes.data.data.access_key,
                generatedOn: new Date(),
                expiresOn: new Date()
            }

            await User.updateOne(
                { "_id": req.user._id },
                { 
                    $push: { "engines.$[engine].roles.$[role].generatedCreds": credObj }
                },
                { "arrayFilters": [{ "engine.name": engineName }, { "role.roleName": roleName }] }
            )
        } catch (err) {
            errorHandler.handleErrorFromError(err)
        }
        errorHandler.handleErrorFromResponse(vaultRes)
        res.status(201).json({
            "message": "user created successfully",
            "access_key": vaultRes.data.data.access_key,
            "secret_key": vaultRes.data.data.secret_key,
            "lease_duration": vaultRes.data.lease_duration
        });
    }
    else {
        res.status(404).json({ "message": "Engine not found" });
    }
}