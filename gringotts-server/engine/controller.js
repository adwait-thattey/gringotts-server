const { createAWSEngine, createKVEngine, createSSHEngine } = require('../utils');
const vault = require('../../vault');

exports.createNewEngine = async (req, res) => {
    const engineType = req.query.engine_type;
    const engineName = req.body.engineName;

    const CA_Configurations = req.body.CA_Configurations;
    const accountName = req.body.accountName;

    if (!engineType) return res.status(400).send("Engine Type not selected");
    
    try {
        const response = await vault.api.mountNewEngine(req.user, engineType);
        const mountPoint = response.relativeMountPoint;

        switch(engineType) {
            case "kv":
                req.user.engines.push(createKVEngine(engineName, engineType, mountPoint));
                break;
            case "aws":
                req.user.engines.push(createAWSEngine(engineName, engineType, mountPoint, accountName));
                break;
            case "ssh":
                req.user.engines.push(createSSHEngine(engineName, engineType, mountPoint, accountName, CA_Configurations));
                break;
        }
        await req.user.save();
    } catch(e) {
        return res.status(400).send(e);
    }
}