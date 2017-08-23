global.__path = require('path')

global.__os = require('os')

global.__base = __dirname;

global.__config = require(__path.join(__base, 'config.json'));

global.__logger = require(__path.join(__base, 'setup', 'logger.js')).getLogger()

global.__factory = require(__path.join(__base, 'factory', 'factory.js'));

global.__util = require(__path.join(__base, 'util', 'util.js'));

global.__constants = require(__path.join(__base, 'util', 'constant.js')).getConstants()

global.__async = require('async')

global.__cache = require('cache-manager').caching({ store: 'memory', max: 10000, ttl: 180000/*seconds*/ });

__async.series([
    function (callback) {
        var server = require(__path.join(__base, 'setup', 'server.js'))
        callback()
    },
    function (callback) {
        const sqlserver = require(__path.join(__base, 'setup', 'sqlserver.js'))
        global.__sqlutil = sqlserver
        callback()
    },
    function (callback) {
        global.__cache_loader = require(__path.join(__base, 'setup', 'cacheloader.js'))

        __cache_loader.loadItemsToCache(function (err, res) {
            if (err) {
                __logger.error(err)
                throw err
            }
            callback()
        })
    }
], function (err) {
    if (err) {
        __logger.error(err)
        throw err
    }
})

