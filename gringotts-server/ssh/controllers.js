const vault = require('../vault');
const User = require('../auth/model/user');
const mongoose = require('mongoose');
// const errorHandler = require('../vault/errorHandler');
const vaultErrorHandler = require('../vault/errorHandler');
const keygen = require('ssh-keygen');
const fs = require('fs');

const checkEngineExists = async eng_name => {
    return User.findOne(
        {"engines.name": eng_name, "engines.engineType": "ssh"}
    );
}


exports.configureCA = async (req, res) => {
    const engName = req.params.engine_name;
    const payload = {
        "generate_signing_key": true
    }

    var engine_check_status = await checkEngineExists(engName);

    if (engine_check_status) {
        let vaultRes;
        try {
            vaultRes = await vault.api.makeVaultRequest(req.user, `${engName}/config/ca`, "POST", "ssh", payload);

        } catch (err) {
            vaultErrorHandler.handleErrorFromError(err)
        }
        vaultErrorHandler.handleErrorFromResponse(vaultRes);
        const user = await User.updateOne (
            { _id: req.user._id, "engines.name": engName, "engines.engineType": "ssh"},
            { $set: { "engines.$.status": 1 } }
        );

        res.status(201).json({"message": "CA configured successfully"});
    } else {
        res.status(404).json({"message": "Engine not found"});
    }
};

exports.getCAPublicKey = async (req, res) => {
    const engName = req.params.engine_name;

    if (!await checkEngineExists(engName)) {
        return res.status(400).json({"message": "This engine does not exist"})
    }

    let vaultRes;
    try {
        vaultRes = await vault.api.makeVaultRequest(req.user, `${engName}/public_key`, "GET", "ssh");
        console.log(vaultRes)
    } catch (err) {
        console.log(err)
        vaultErrorHandler.handleErrorFromError(err)
    }

    vaultErrorHandler.handleErrorFromResponse(vaultRes);

    let publicKey = vaultRes.data;
    publicKey = publicKey.trim('\n');
    res.status(200).json({
        "CAPublicKey": publicKey
    })
};

exports.configureMachine = async (req, res) => {
    const engName = req.params.engine_name;

    const hostIP = req.body.hostIP;
    const hostDomain = req.body.hostDomain;
    const hostUsername = req.body.hostUsername;
    const ttl = req.body.ttl || "5m0s";

    if (!await checkEngineExists(engName)) {
        return res.status(400).json({"message": "This engine does not exist"})
    }
    const specialCHarFormat = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]+/;
    if (!hostIP && !hostDomain) {
        return res.status(400).json({"errors": "Both hostName and hostIP can not be empty"})
    }
    if (!hostUsername) {
        return res.status(400).json({"errors": "Host username must not be empty"})
    }

    if (specialCHarFormat.test(hostUsername)) {
        return res.status(400).json({"errors": "host Username can not contain special characters"})
    }
    const payload = {
        "allow_user_certificates": true,
        "allowed_users": "*",
        "default_extensions": [
            {
                "permit-pty": ""
            }
        ],
        "key_type": "ca",
        "default_user": "ubuntu",
        "ttl": ttl
    };

    const hostIdentifier = hostIP || hostDomain;
    const roleName = `role__${hostUsername}__${hostIdentifier.replace(/\./g, '_')}`;

    let vaultRes;
    try {
        vaultRes = await vault.api.makeVaultRequest(req.user, `${engName}/roles/${roleName}`, "POST", "ssh", payload);

    } catch (err) {
        console.log(err)
        vaultErrorHandler.handleErrorFromError(err)
    }

    vaultErrorHandler.handleErrorFromResponse(vaultRes);

    try {
        const roleObj = {
            _id: mongoose.Types.ObjectId(),
            verboseName: roleName,
            machine_ip: hostIP,
            machine_domain: hostDomain,
            machine_username: hostUsername,
            ttl,
            generated_keys: []
        }

        await User.updateOne (
            { _id: req.user._id},
            { $push: { "engines.$[engine].roles": roleObj } },
            { arrayFilters: [ { "engine.engineType": "ssh", "engine.name": engName } ] }
        )

    } catch(e) {
        console.log(e);
    }

    res.status(201).json({"message": "Machine Configured Successfully", "role_name": roleName});
};

exports.generateKey = async (req, res) => {
    const engName = req.params.engine_name;

    const role = req.body.role;
    const keyName = req.body.keyName;
    const keyPassword = req.body.keyPassword;

    if (!await checkEngineExists(engName)) {
        res.status(400).json({"message": "This engine does not exist"})
    }

    if (!role) {
        res.status(400).json({"message": "Provide a role name"})
    }

    // perform a check to make sure role exists
    const default_key_name = `key_${Math.floor((Math.random() * 1000) + 1)}`;
    const actualKeyName = keyName || default_key_name;
    console.log(actualKeyName);
    var location = __dirname + '/tmp/keys/' + actualKeyName;
    let comment = req.user.email;
    let password = keyPassword;

    keygen({
        location: location,
        comment: comment,
        password: password,
        read: true
    }, async (err, out) => {
        if (err) {
            res.status(500).json({"message": "Some error occurred while generating keys"})
        }
        console.log("keys created");

        let publicKey = fs.readFileSync(__dirname + `/tmp/keys/${actualKeyName}.pub`, 'utf8');
        let privateKey = fs.readFileSync(__dirname + `/tmp/keys/${actualKeyName}`, 'utf8');

        privateKey = privateKey.split('\n').join('\\n');
        let lines = publicKey.split(' ');
        lines.pop();
        publicKey = lines.join(' ');
        console.log("Generated Public Key", publicKey);


        const payload = {
            "name": actualKeyName,
            "public_key": publicKey
        };

        const cur_time = new Date();
        let vaultRes;
        try {
            vaultRes = await vault.api.makeVaultRequest(req.user, `${engName}/sign/${role}`, "POST", "ssh", payload);

        } catch (err) {
            vaultErrorHandler.handleErrorFromError(err)
        }
        vaultErrorHandler.handleErrorFromResponse(vaultRes);
        const signedKey = vaultRes.data.data.signed_key.trim('\n');
        fs.writeFileSync(__dirname + `/tmp/keys/${actualKeyName}.cer`, signedKey);
        const serialNumber = vaultRes.data.data.serial_number;

        try {

            const gen_keys = {
                _id: mongoose.Types.ObjectId(),
                generated_on: new Date(),
                serialNumber
            }

            await User.updateOne (
                { _id: req.user._id },
                { $push: { "engines.$[engine].roles.$[role].generated_keys": gen_keys } },
                { arrayFilters: [ { "engine.name": engName, "engine.engineType": "ssh" }, { "role.verboseName": role } ] }
            )
        } catch(e) {

        }

        const response_json = {
            "serialNumber": serialNumber,
            "publicKey": publicKey,
            "privateKey": privateKey,
            "keyCertificate": signedKey,
            "createdOn": cur_time,
            "ttl": "some ttl",
            "message": "Usage: ssh -i private_key -i certificate username@ip"
        };

        res.status(200).json(response_json)
        // send a file response with private key and certificate
    })
}