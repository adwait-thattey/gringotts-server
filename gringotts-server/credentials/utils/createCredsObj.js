const mongoose = require('mongoose');

module.exports = (credType, { engineName, categoryName, credName, phone }) => {
    let dataObj = {
        _id: mongoose.Types.ObjectId(),
        vaultPath: `/creds/${engineName}/${categoryName}/${credName}`,
        credName,
        createdAt: new Date()
    };
    
    switch(credType) {
        case "social_media":
            dataObj = {
                ...dataObj,
                phone: phone
            }
            break;
        default:
            break;
    }

    return dataObj;
}