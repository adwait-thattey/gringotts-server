const mongoose = require('mongoose');

module.exports = (credType, { engineName, categoryName, credName, phone }) => {
    let dataObj = {
        _id: mongoose.Types.ObjectId(),
        credName,
        createdAt: new Date()
    };

    switch (credType) {
        case "social_media":
            dataObj = {
                ...dataObj,
                phone: phone
            }
            break;
        case "kv":
            dataObj = {
                ...dataObj,
                phone: phone,
                vaultPath: `/kv/${engineName}/${categoryName}/${credName}`,
            }
            break;
        default:
            break;
    }

    return dataObj;
}