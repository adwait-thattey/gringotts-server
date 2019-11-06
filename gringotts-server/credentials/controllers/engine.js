const { getMountedEngines } = require('../../vault/api');
const User = require('../../auth/model/user');
const url = require('url');

exports.getCredEngine = async (req, res) => {
    try {
        const kvEngines = await getMountedEngines(req.user, "kv");
        return res.status(200).send(kvEngines);
    } catch (e) {
        return res.status(400).send(e);
    }
}

exports.addCustomCategory = async (req, res) => {
    const engineName = req.params.engineName;

    const categoryName = req.body.categoryName;
    const verboseName = req.body.verboseName;

    const dataObj = {
        name: categoryName,
        verboseName,
        creds: []
    };

    try {

        await User.updateOne(
            { _id: req.user._id, "engines.verboseName": engineName },
            {
                $push: {
                    "engines.$.categories": dataObj
                }
            }
        )

        // "find" returns the reference to the object
        // Hence updating it will update the original object

        return res.status(200).json({
            success: "New category successfully added",
            dataObj
        })
    } catch (e) {
        return res.status(500).send("error");
    }
}

exports.createCreds = async (req, res) => {
    const engineName = req.query.engineName;
    const categoryName = req.query.categoryName;

    const credName = req.body.credName;
    const credValue = req.body.credValue;

    try {
        const engine = req.user.engines.find(engine => engine.verboseName === engineName);
        const category = engine.categories.find(category => category.name === categoryName);

        category.creds.push({
            credName,
            credValue,
            path: url.resolve(engineName, categoryName, credName)
        })

        await req.user.save();
    } catch (e) {
        return res.status(500).send(e);
    }
}