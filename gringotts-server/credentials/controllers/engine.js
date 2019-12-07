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

    const dataObj = {
        name: categoryName,
        creds: [],
    };

    try {
        const response = await User.findOne(
            { _id: req.user._id, "engines.categories.name": categoryName },
        );

        if (response) {
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
    const credName = req.params.credName;

    console.log(engineName, categoryName, credName);

    try {
        const userInfo = await User.findOne(
            { _id: req.user._id, "engines.name": engineName },
            { "engines.$.categories": 1 }
        )

        const category = userInfo.engines[0].categories.find(category => category.name === categoryName);
        if (!category) {
            return res.status(404).send("No category with this name was found");
        }

        const vaultPath = `${engineName}/${categoryName}/${credName}`;

        // user, uri, type, payload, customHeaders, appendPath=true
        const { data } = await vault.makeVaultRequest(req.user, vaultPath, "GET", "kv");
        return res.status(200).json({ data: data.data[credName] });
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.createCreds = async (req, res) => {
    const engineName = req.params.engineName;
    const engineType = req.params.engineType;
    const categoryName = req.params.categoryName;

    const credName = req.body.credName;
    const credValue = req.body.credValue;
    const providerName = req.body.providerName;

    // For social_media phone may be needed field
    const phone = req.body.phone;
    try {
        // Finding the engine
        const userInfo = await User.findOne(
            { "_id": req.user._id, "engines.name": engineName },
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
            engineName, categoryName, credName, phone, providerName
        });

        const vaultPath = `${engineName}/${categoryName}/${credName}`;

        // user, uri, type, payload, customHeaders, appendPath=true
        const { data } = await vault.makeVaultRequest(req.user, vaultPath, "POST", engineType ,{ [credName]: credValue } );

        await User.updateOne (
            { "_id": req.user._id }, 
            { $push: { "engines.$[engine].categories.$[category].creds": credObj }}, 
            { "arrayFilters": [{"engine.name": engineName}, { "category.name": categoryName }]}
        )

        res.status(200).json({ success: "Credential Successfully added" });
    } catch (e) {
        console.log(e);
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
            { arrayFilters: [ { "engine.name": engineName, "engine.engineType": engineType }, { "category.name": categoryName } ] }
        )
        return res.status(200).send("Creds successfully removed")
    } catch(e) {
        return res.status(500).send(e);
    }
}

exports.getSpecificEngine = async (req, res) => {
    const engineName = req.params.engine_name;

    try {
        const userInfo = await User.findOne(
            { _id: req.user._id, "engines.name": engineName, "engines.engineType": "kv" },
            { "engines.$": 1 }
        )
        console.log(userInfo);
        if (!userInfo) return res.status(404).json({ err: "No kv engine with given name found" })

        return res.status(200).json({ userInfo });
    } catch(e) {
        return res.status(500).send(e);
    }
}