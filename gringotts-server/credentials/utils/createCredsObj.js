const mongoose = require('mongoose');

module.exports = (credType, { engineName, categoryName, credName, providerName }) => {
    let dataObj = {
        _id: mongoose.Types.ObjectId(),
        key: credName,
        createdOn: new Date(),
        vaultPath: `/kv/${engineName}/${categoryName}/${credName}`,
        providerName
    };
    
    return dataObj;
}