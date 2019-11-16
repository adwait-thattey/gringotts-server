const mongoose = require('mongoose');

module.exports = (credType, { engineName, categoryName, credName, providerName }) => {
    let dataObj = {
        credName: mongoose.Types.ObjectId(),
        createdOn: new Date(),
        vaultPath: `/kv/${engineName}/${categoryName}/${credName}`,
        providerName
    };
    
    return dataObj;
}