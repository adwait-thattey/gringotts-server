const data = {
    "vaultTokens": {
        "testuser": "testtoken"
    }
};

exports.fetch = key => {
    return data[key];
};

exports.store = (key, value) => {
    data[key] = value
};

exports.search = key => {
    return key in data;
};

exports.fetchToken = username => {
    if (username in data.vaultTokens) {
        return data.vaultTokens[username];
    }
    return null;
};

exports.storeToken = (username, token) => {
    data.vaultTokens[username] = token;
};