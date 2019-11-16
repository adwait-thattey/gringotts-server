const { createAWSEngine, createKVEngine, createSSHEngine } = require('../credentials/utils');
const vault = require('../vault');
const User = require('../auth/model/user');

exports.createNewEngine = async (req, res) => {
    const engineType = req.params.engine_type;
    const CA_Configurations = req.body.CA_Configurations;

    if (!engineType) return res.status(400).send("Engine Type not selected");
    
    try {
        let engineInfo;

        // Making sure engine name is unique
        const verboseNames = await User.find({ _id: req.user._id }).distinct('engines.name');
        
        // MOUNT ENGINE IN VAULT
        const { relativeMountPoint:autoEngName } = await vault.api.mountNewEngine(req.user, engineType);
        
        if (verboseNames.includes(autoEngName)) {
            return res.status(400).send("Given engine name already exists");
        }

        switch(engineType) {
            case "kv":
                engineInfo = createKVEngine(autoEngName, engineType);
                break;
            case "aws":
                engineInfo = createAWSEngine(autoEngName, engineType);
                break;
            case "ssh":
                engineInfo = createSSHEngine(autoEngName, engineType, autoEngName, accountName, CA_Configurations);
                break;
        }

        await User.updateOne(
            { _id: req.user._id },
            { $push: { engines: engineInfo } }
        )
        return res.status(200).send("Successfully mounted new engine")
    } catch(e) {
        return res.status(400).send(e);
    }
}