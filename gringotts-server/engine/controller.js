const { createAWSEngine, createKVEngine, createSSHEngine } = require('../credentials/utils');
const vault = require('../vault');
const User = require('../auth/model/user');

exports.createNewEngine = async (req, res) => {
    console.log(req.user);
    console.log("CREATE ENGINE");


    const engineType = req.params.engine_type;
    const CA_Configurations = req.body.CA_Configurations;
    if (!engineType) return res.status(400).send("Engine Type not selected");
    if (engineType === "ssh" && !engineType) {
        return res.status(400).send("SSH engine requires CA_configuration");
    }

    try {
        let engineInfo;
        // MOUNT ENGINE IN VAULT
        const { relativeMountPoint: autoEngName } = await vault.api.mountNewEngine(req.user, engineType);

        switch (engineType) {
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
        return res.status(200).json({ engineInfo });
    } catch (e) {
        console.log(e);
        return res.status(400).send(e);
    }
}

exports.getAllEngines = async (req, res) => {
    console.log(req.user);
    console.log("GET ENGINES");
    try {
        const userInfo = await User.findOne({ _id: req.user._id });
        const engineList = [];

        userInfo.engines.map((engine, index) => {
            let credCount = 0;
            let temp;

            if (engine.engineType === "kv") {
                engine.categories.map(category => {
                    credCount += category.creds.length;
                })
                temp = { categories: engine.categories }

            } else if (engine.engineType === "aws") {
                engine.roles.map(role => {
                    credCount += role.generatedCreds.length;
                })
                temp = { categories: engine.roles }
            }

            engineList.push({
                id: index + 1,
                name: engine.name,
                type: engine.engineType,
                health: true,
                createdOn: engine.createdAt,
                credCount,
                ...temp
            })

        });
        return res.status(200).send(engineList);
    } catch(e) {
        console.log(e);
        return res.status(500).send(e);
    }
}