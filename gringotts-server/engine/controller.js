const { createAWSEngine, createKVEngine, createSSHEngine } = require('../credentials/utils');
const vault = require('../vault');
const User = require('../auth/model/user');

exports.createNewEngine = async (req, res) => {
    const engineType = req.params.engine_type;
    const engineName = req.body.engineName;

    const CA_Configurations = req.body.CA_Configurations;
    const accountName = req.body.accountName;

    if (!engineType) return res.status(400).send("Engine Type not selected");
    
    try {
        // const response = await vault.api.mountNewEngine(req.user, engineType);
        // const mountPoint = response.relativeMountPoint || "something";
        const mountPoint = "something";
        
        let engineInfo;


        // Making sure engine name is unique
        const verboseNames = await User.find({ _id: req.user._id }).distinct('engines.verboseName');
        
        if (verboseNames.includes(engineName)) {
            return res.status(400).send("Given engine name already exists");
        }


        switch(engineType) {
            case "kv":
                engineInfo = createKVEngine(engineName, engineType, mountPoint);
                break;
            case "aws":
                engineInfo = createAWSEngine(engineName, engineType, mountPoint, accountName);
                break;
            case "ssh":
                engineInfo = createSSHEngine(engineName, engineType, mountPoint, accountName, CA_Configurations);
                break;
        }

        // MOUNT ENGINE IN VAULT
        await vault.api.mountNewEngine(req.user, engineType);


        await User.updateOne(
            { _id: req.user._id },
            { $push: { engines: engineInfo } }
        )

        return res.status(200).send("Successfully mounted new engine")
    } catch(e) {
        return res.status(400).send(e);
    }
}