const { mountNewEngine } = require('../vault/api');

exports.createEngine = async () => {
    const type = req.body.type;
    try {
        const mountEngine = await mountNewEngine(req.user, type);
    } catch(e) {
        return res.status(401).send(e);
    }
}