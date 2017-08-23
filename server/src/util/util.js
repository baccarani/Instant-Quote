(function () {
    var dateUtils = require('moment');
    var collections = require('buckets-js');
    var xml2js = require('xml2js');
    var https = require('https');

    /**
     * Utility function to pad 0 to the end of the Sting for the given length.
     * 
     * @param {any} str 
     * @param {any} length 
     * @returns 
     */
    var pad = function (str, length) {
        while (str.length < length) {
            str = str + '0';
        }
        return str;
    }

    /**
     * This function returns Moment object
     * 
     * @returns 
     */
    var getDateUtil = function () {
        return dateUtils;
    }

    /**
     * THis function is used to store the data into the cache with the given key
     * 
     * @param {any} id 
     * @param {any} value 
     * @param {any} callback 
     */
    var storeInCache = function (id, value, callback) {
        __cache.set(id, value, { ttl: 3000000 }, function (err) {
            if (err) {
                __logger.error(err)
                return callback(__constants.SYSTEM_ERROR)
            }
            callback(null)
        });
    }

    /**
     * This function is used to get the data from the cache for the given key
     * 
     * @param {any} id 
     * @param {any} callback 
     */
    var getFromCache = function (id, callback) {
        __cache.get(id, function (err, result) {
            if (err) {
                __logger.error(err)
                return callback(__constants.SYSTEM_ERROR)
            }
            callback(err, result)
        });
    }

    /**
     * This function is used to delete the data from the cache for the given key
     * 
     * @param {any} id 
     * @param {any} callback 
     */
    var deleteFromCache = function (id, callback) {
        __cache.del(id, function (err, result) {
            if (err) {
                __logger.error(err)
                return callback(__constants.SYSTEM_ERROR)
            }
            callback(err, result)
        });
    }

    /**
     * This function returns Collections library bucket-js
     * 
     * @returns 
     */
    var getCollections = function () {
        return collections;
    }

    /**
     * This function reads XML data from the given URL and map it to JSON and return the JSON object via callback
     * 
     * @param {any} url 
     * @param {any} callback 
     */
    var getXMLDataFromURL = function (url, callback) {
        var xmlData = '';
        var jsonData = null
        __async.waterfall([
            function (callback) {
                https.get(url, function (res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        xmlData += chunk;
                    });
                    res.on('end', function () {
                        callback()
                    });
                    res.on('error', function (err) {
                        return callback(__constants.SYSTEM_ERROR);
                    });
                });
            },
            function (callback) {
                var parser = new xml2js.Parser();
                parser.parseString(xmlData, function (err, result) {
                    if (err) {
                        return callback(__constants.SYSTEM_ERROR);
                    } else {
                        jsonData = result
                        callback();
                    }
                });
            }
        ], function (err) {
            if (err) {
                __logger.error(err)
                return callback(err)
            } else {
                callback(err, jsonData)
            }
        });
    }

    module.exports = {
        'getDateUtil': getDateUtil,
        'storeInCache': storeInCache,
        'getFromCache': getFromCache,
        'deleteFromCache': deleteFromCache,
        'getCollections': getCollections,
        'getXMLDataFromURL': getXMLDataFromURL
    };
}());