

const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL: 60,
    checkperiod: 120
});

function cacheMiddleware(duration = 60) {
    return (req, res, next) => {
        const key = req.originalUrl;

        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            return res.json(cachedResponse);
        }

        const originalJson = res.json.bind(res);

        res.json = (body) => {
            cache.set(key, body, duration);
            return originalJson(body);
        };

        next();
    };
}

function clearCache() {
    cache.flushAll();
}

module.exports = {
    cacheMiddleware,
    clearCache
};