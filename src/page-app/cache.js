const contentCache = {};

function putCache(name, data) {
    contentCache[name] = data;
}

function getCache(name) {
    return contentCache[name];
}

function deleteCache(name) {
    delete contentCache[name]
}

const Cache = { putCache, getCache, deleteCache }