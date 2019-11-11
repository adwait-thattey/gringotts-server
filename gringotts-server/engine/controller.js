const { createAWSEngine, createKVEngine, createSSHEngine } = require('../credentials/utils');
const vault = require('../vault');
const User = require('../auth/model/user');

exports.createNewEngine = async (req, res) => {
    const engineType = req.params.engine_type;

    
    const CA_Configurations = req.body.CA_Configurations;
    const accountName = req.body.accountName;

    if (!engineType) return res.status(400).send("Engine Type not selected");
    
    try {
        let engineInfo;

        // Making sure engine name is unique
        const verboseNames = await User.find({ _id: req.user._id }).distinct('engines.verboseName');
        
        if (verboseNames.includes(engineName)) {
            return res.status(400).send("Given engine name already exists");
        }

        // MOUNT ENGINE IN VAULT
        const { relativeMountPoint } = await vault.api.mountNewEngine(req.user, engineType);

        switch(engineType) {
            case "kv":
                engineInfo = createKVEngine(engineName, engineType, relativeMountPoint);
                break;
            case "aws":
                engineInfo = createAWSEngine(engineName, engineType, relativeMountPoint, accountName);
                break;
            case "ssh":
                engineInfo = createSSHEngine(engineName, engineType, relativeMountPoint, accountName, CA_Configurations);
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