const { getMountedEngines } = require('../../vault/api');
const vault = require('../../vault');
const createKVEngine = require('../utils/createKVEngine');

exports.getCredEngine = async (req, res) => {
    try {
        const kvEngines = await getMountedEngines(req.user, "kv");
        return res.status(200).send(kvEngines);
    } catch(e) {
        return res.status(400).send(e);
    }
}

exports.createNewEngine = async (req, res) => {
    const engineType = req.query.engine_type;
    const engineName = req.body.engineName;

    if (!engineType) return res.status(400).send("Engine Type not selected");
    
    try {
        const response = await vault.api.mountNewEngine(req.user, engineType);
        const mountPoint = response.relativeMountPoint;

        switch(engineType) {
            case "kv":
                req.user.engines.push(createKVEngine(engineName, engineType, mountPoint));
                break;
            case "ssh":
                
        }

        await req.user.save();
    } catch(e) {
        return res.status(400).send(e);
    }
}