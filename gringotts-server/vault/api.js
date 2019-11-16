const config = require('../config');
const axios = require('axios');
const url = require('url');
const errors = require('./vaultErrors');
const vaultErrorHandler = require('./errorHandler');
const localStorage = require('./localStorage');
const utils = require('./utils');

const rootHeaders  = {
    "Content-Type":"application/json",
    "Accept":"application/json",
    "User-Agent": "Request-Promise",
    "X-Vault-Token": config.vault.adminToken
};

const getVaultAuthAccessor = async () => {
    let res;
    try {
        res = await axios.get(
            url.resolve(config.vault.host, "sys/auth"),
            {
                headers: rootHeaders,
                validateStatus: false
            }
        )

    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err);
    };

    vaultErrorHandler.handleErrorFromResponse(res);

    // console.log(res)
    return res.data["userpass/"]["accessor"]
};

exports.createUser = async (user) => {
    /* User object must contain at least username and password */

    // check if vault user already exists
    let res;
    try {
        res = await axios.get(
            url.resolve(config.vault.host, `auth/userpass/users/${user.username}`),
            {
                headers: rootHeaders,
                validateStatus: false
            }
        )

    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err);
    };

    // console.log(res);
    if (res.status === 200) {
        throw new errors.VaultUserExistsError();
    }
    if (res.status !== 404) {
        vaultErrorHandler.handleErrorFromResponse(res);
    }
    // user does not exist. Proceed

    // create a new user
    const userCreatePayload = {
        username: user.username,
        password: user.password,
        token_ttl: "300",
        token_max_ttl: "300",
        policies : []
    };

    try {
        res = await axios.post(
            url.resolve(config.vault.host, `auth/userpass/users/${user.username}`),
            userCreatePayload,
            {
                headers: rootHeaders,
                validateStatus: false
            }
        )

    }catch (err) {
        vaultErrorHandler.handleErrorFromError(err);
    };

    vaultErrorHandler.handleErrorFromResponse(res);

    // create identity for user

    const identyCreatePayload = {
        name: user.username,
        policies: ["gringotts-user"]
    };

    try {
        res = await axios.post(
            url.resolve(config.vault.host, `identity/entity`),
            identyCreatePayload,
            {
                headers: rootHeaders,
                validateStatus: false
            }
        )

    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err);
    };

    if(res.status === 204) {
        // identity already exists. throw error
        throw new errors.VaultUserExistsError("An identity with this name already exists. Choose another username or contact the administrator to delete the existing ID");
    }
    vaultErrorHandler.handleErrorFromResponse(res);

    // console.log(res);
    // attach identity to user
    const canonicalId = res.data.data.id;
    const identityAttachPayload = {
        name: user.username,
        canonical_id: canonicalId,
        mount_accessor: await getVaultAuthAccessor()
    };

    try {
        res = await axios.post(
            url.resolve(config.vault.host, `identity/entity-alias`),
            identityAttachPayload,
            {
                headers: rootHeaders,
                validateStatus: false
            }
        )

    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err);
    }

    vaultErrorHandler.handleErrorFromResponse(res);

    return true
};

exports.getMountedEngines = async (user, type) => {

    // get list of all mounted engines
    let res;
    try {
        res = await axios.get(
            url.resolve(config.vault.host, `sys/mounts`),
            {
                headers: rootHeaders,
                validateStatus: false
            }
        )

    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err);
    }

    vaultErrorHandler.handleErrorFromResponse(res);

    let enginePaths = Object.keys(res.data);

    if (!type) return enginePaths;

    enginePaths = enginePaths.filter(
        path => path.startsWith(`gringotts-user/${user.username}/${type}`)
    );
    enginePaths = enginePaths.map(engine => engine.replace(`gringotts-user/${user.username}`, ''));
    return enginePaths;
};

const mountNewKVEngine = async (user, name) => {
    let res;
    try {
        res = await axios.post(
            url.resolve(config.vault.host, `sys/mounts/gringotts-user/${user.username}/kv/${name}`),
            {
                type: "kv",
                description: "A new KV engine for User " + user.username
            },
            {
                headers: rootHeaders,
                validateStatus: false
            }

        )
    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err)
    }

    // console.log(res);
    vaultErrorHandler.handleErrorFromResponse(res);

    if (res.status === 204) {
        return {
            type: "kv",
            relativeMountPoint: name,
            absoluteMountPoint: `/gringotts-user/${user.username}/kv/${name}`
        }
    }
    else {
        throw new errors.VaultError("Some error occured during mounting new engine")
    }
};

const mountNewAWSEngine = async (user, name) => {
    let res;
    try {
        res = await axios.post(
            url.resolve(config.vault.host, `sys/mounts/gringotts-user/${user.username}/aws/${name}`),
            {
                type: "aws",
                description: "A new AWS engine for User " + user.username
            },
            {
                headers: rootHeaders,
                validateStatus: false
            }

        )
    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err)
    }

    console.log(res);
    vaultErrorHandler.handleErrorFromResponse(res);

    if (res.status === 204) {
        return {
            type: "aws",
            relativeMountPoint: name,
            absoluteMountPoint: `/gringotts-user/${user.username}/aws/${name}`
        }
    }
    else {
        throw new errors.VaultError("Some error occurred during mounting new engine")
    }
};

const mountNewSSHEngine = async (user, name) => {
    let res;
    try {
        res = await axios.post(
            url.resolve(config.vault.host, `sys/mounts/gringotts-user/${user.username}/ssh/${name}`),
            {
                type: "ssh",
                description: "A new SSH engine for User " + user.username
            },
            {
                headers: rootHeaders,
                validateStatus: false
            }

        )
    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err)
    }

    // console.log(res);
    vaultErrorHandler.handleErrorFromResponse(res);

    if (res.status === 204) {
        return {
            type: "ssh",
            relativeMountPoint: name,
            absoluteMountPoint: `/gringotts-user/${user.username}/ssh/${name}`
        }
    }
    else {
        throw new errors.VaultError("Some error occurred during mounting new engine")
    }
};

exports.mountNewEngine = async (user, type) => {
    // get list of existing engines on path
    let engPrefix = "eng";
    let engines  = await this.getMountedEngines(user, type);
    engines.sort();
    let ix=1;
    for (let eng of engines){
        console.debug(eng);
        const chk = eng !== `/${type}/${engPrefix}${ix}/`;
        if (chk) break;
        ix+=1
    }

    const newEngineName = engPrefix + ix;
    switch (type) {
        case "kv":
            return await mountNewKVEngine(user, newEngineName);
        case "aws":
            return await mountNewAWSEngine(user, newEngineName);
        case "ssh":
            return await mountNewSSHEngine(user, newEngineName);
        case "azure": {
            console.log("Not configured yet");
            throw new errors.VaultError("Engine APIs not configured yet")
        }
    }
};

exports.makeVaultRequest = async (user, uri, requestType, engineType, payload, customHeaders, appendPath=true ) => {
    requestType = requestType.toLowerCase();
    engineType = engineType.toLowerCase();

    let vaultToken = localStorage.fetchToken(user.username);
    if (!vaultToken) {
        vaultToken = await utils.getToken(user);
    }
    let res;
    let relativeUserEnginePath = `gringotts-user/${user.username}/${engineType}/`;
    let finalURL = config.vault.host;
    if (appendPath) {
        finalURL = url.resolve(finalURL, relativeUserEnginePath);
        console.log(finalURL)
    }
    finalURL = url.resolve(finalURL, uri);
    console.log(finalURL);
    try {
        res = await axios({
            url: finalURL,
            method: requestType,
            data: payload,
            headers: {
                "X-Vault-Token": vaultToken,
                ...customHeaders
            },
            validateStatus: false
        })
    } catch (err) {
        vaultErrorHandler.handleErrorFromError(err);
    }
    vaultErrorHandler.handleErrorFromResponse(res);

    return {
        status: res.status,
        data: res.data
    }
};