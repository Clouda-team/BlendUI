define(function () {

    function feed(target) {
        var metaElements = document.getElementsByTagName("META");
        var metaCount = metaElements.length;

        var collectAll;
        var index;
        var element;
        var name;
        var content;

        collectAll = false;
        if (!target) {
            target = {};
            collectAll = true;
        }

        for (index = 0; index < metaCount; index++) {
            element = metaElements[index];
            name = element.name;
            content = element.content;
            setCache(name, content);
            if (collectAll || target.hasOwnProperty(name)) {
                target[name] = content;
            }
        }

        cacheInited = true;
        return target;
    }

    var metaCache;
    var cacheInited;

    function setCache(name, content) {
        metaCache[name] = content;
    }

    function hasCache(name) {
        return metaCache.hasOwnProperty(name);
    }

    function getCache(name) {
        return metaCache[name];
    }

    function clearCache() {
        metaCache = {};
        cacheInited = false;
    }

    clearCache();

    function get(name, defaultValue) {
        if (hasCache(name)) {
            return getCache(name);
        }

        if (cacheInited) {
            return defaultValue;
        }

        var obj = {};
        obj[name] = defaultValue;
        feed(obj);

        return obj[name];
    }

    return {
        feed: feed,
        setCache: setCache,
        hasCache: hasCache,
        getCache: getCache,
        clearCache: clearCache,
        get: get
    };
});
