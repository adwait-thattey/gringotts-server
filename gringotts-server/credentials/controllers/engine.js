const { getMountedEngines } = require('../../vault/api');

exports.getCredEngine = async (req, res) => {
    try {
        const kvEngines = await getMountedEngines(req.user, "kv");
        return res.status(200).send(kvEngines);
    } catch(e) {
        return res.status(400).send(e);
    }
}