function normalizeURL(urlStr) {
    const urlObject = new URL(urlStr);
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`

    if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1);
    }

    return hostPath;
}

module.exports = {
    normalizeURL
}