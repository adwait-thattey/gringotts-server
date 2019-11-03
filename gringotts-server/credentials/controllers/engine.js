const { getMountedEngines } = require('../../vault/api');
const User = require('../../auth/model/user');

exports.getCredEngine = async (req, res) => {
    try {
        const kvEngines = await getMountedEngines(req.user, "kv");
        return res.status(200).send(kvEngines);
    } catch (e) {
        return res.status(400).send(e);
    }
}

exports.addCustomCategory = async (req, res) => {
    const engineName = req.query.engineName;

    const categoryName = req.body.categoryName;
    const verboseName = req.body.verboseName;

    try {
        // "find" returns the reference to the object
        // Hence updating it will update the original object
        let engine = req.user.engines.find(engine => engine.name === engineName);

        // As "name" field must be unique, verify no category with given name exist
        const engineNames = engine.categories.filter(category => category.name === categoryName);
        if (engineNames.length > 0) return res.status(500).send("Given Name already exists");

        engine.categories.push({ name: categoryName, verboseName, creds: [] });
        await req.user.save();
    } catch(e) {
        return res.status(500).send("error");
    }
}

