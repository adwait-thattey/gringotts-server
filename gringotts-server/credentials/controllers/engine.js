const { getMountedEngines } = require('../../vault/api');
const User = require('../../auth/model/user');
const vault = require('../../vault/api');
const { createCredsObj } = require('../utils');

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
    const name = req.body.name;

    const dataObj = {
        name: categoryName,
        name,
        creds: []
    };

    try {

        const response = await User.findOne(
            { engines: { $elemMatch: { name: "kv2" } } },
            { "engines.$.categories": 1 }
        );

        const duplicates = response.engines[0].categories.find(category => category.name === categoryName);
        if (duplicates !== undefined) {
            return res.status(400).send("Category name already exists");
        }

        await User.updateOne(
            { _id: req.user._id, "engines.name": engineName },
            {
                $push: {
                    "engines.$.categories": dataObj
                }
            }
        )

        return res.status(200).json({
            success: "New category successfully added",
            dataObj
        })
    } catch (e) {
        return res.status(500).send("error");
    }
}

exports.deleteCategory = async (req, res) => {
    const engineName = req.params.engineName;
    const categoryName = req.body.categoryName;

    try {
        const userInfo = await User.findOne(
            { _id: req.user._id, "engines.name": engineName },
            { "engines.$.categories": 1 }
        )

        const categories = userInfo.engines[0].categories;

        const { name, creds } = categories.find(category => category.name === categoryName);

        if (creds.length > 0) {
            return res.status(404).send("Delete all credentials before deleting category");
        }

        await User.updateOne(
            { _id: req.user._id },
            { $pull: { "engines.$[engine].categories": { name } } },
            { arrayFilters: [ { "engine.name": engineName } ] },
        )

        return res.status(200).send("Creds successfully removed")
    } catch(e) {
        return res.status(500).send(e);
    }
}



exports.getCreds = async (req, res) => {
    const engineName = req.params.engineName;
    const categoryName = req.params.categoryName;
    const credName = req.body.credName;

    try {
        const userInfo = await User.findOne(
            { _id: req.user._id, "engines.name": engineName },
            { "engines.$.categories": 1 }
        )

        const category = userInfo.engines[0].categories.find(category => category.name === categoryName);
        if (!category) {
            return res.status(404).send("No category with this name was found");
        }

        const { vaultPath } = category.creds.find(cred => cred.credName === credName);
        if (!vaultPath) {
            return res.status(404).send("No credentials found");
        }

        // user, uri, type, payload, customHeaders, appendPath=true
        const { data } = await vault.makeVaultRequest(req.user, vaultPath, "GET");

        return res.status(200).json({ data });
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.createCreds = async (req, res) => {
    const engineName = req.params.engineName;
    const categoryName = req.params.categoryName;

    const credName = req.body.credName;
    const credValue = req.body.credValue;

    // For social_media phone may be needed field
    const phone = req.body.phone;

    try {
        // Finding the engine
        const userInfo = await User.findOne(
            { "engines.name": engineName },
            { "engines.$.categories": 1 }
        )
        if (userInfo.engines.length === 0) {
            return res.status(404).send("No engine with this name was found");
        }
        
        // Getting the category from engine
        const category = userInfo.engines[0].categories.find(category => category.name === categoryName);
        
        if (!category) {
            return res.status(404).send("No category with this name was found");
        }

        const duplicateCred = category.creds.find(cred => cred === credName);
        if (duplicateCred) {
            return res.status(400).send("Given Cred Name already exists, choose another one");
        }

        const credObj = createCredsObj(userInfo.engines[0].engineType, {
            engineName, categoryName, credName, phone
        });

        const { data } = await vault.makeVaultRequest(req.user, vaultPath, "POST");

        await User.updateOne (
            { "_id": req.user._id }, 
            { $push: { "engines.$[engine].categories.$[category].creds": credObj }}, 
            { "arrayFilters": [{"engine.name": engineName}, { "category.name": categoryName }]}
        )

        res.status(200).send("Mast Mast");
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.removeCreds = async (req, res) => {
    const engineName = req.params.engineName;
    const categoryName = req.params.categoryName;
    const credName = req.body.credName;
    try {
        await User.updateOne(
            { _id: req.user._id },
            { $pull: { "engines.$[engine].categories.$[category].creds": { "credName": credName } } },
            { arrayFilters: [ { "engine.name": engineName }, { "category.name": categoryName } ] }
        )

        return res.status(200).send("Creds successfully removed")
    } catch(e) {
        return res.status(500).send(e);
    }
}