const contentCache = {};

function putCache(name, data) {
    contentCache[name] = data;
}

function getCache(name) {
    return contentCache[name];
}

const Cache = { putCache, getCache }