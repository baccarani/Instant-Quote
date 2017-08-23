(function () {
    var sql = require('mssql'),
        connPoolPromise = null;

    var sqlRequestObj = null

    /**
     * This function configure SQL server DB and returns connection pool as Promise
     * 
     * @returns 
     */
    var getConnPoolPromise = function () {
        if (connPoolPromise) return connPoolPromise;

        connPoolPromise = new Promise(function (resolve, reject) {
            var conn = new sql.ConnectionPool(__config.sqlserver);

            conn.on('close', function () {
                connPoolPromise = null;
            });

            conn.connect().then(function (connPool) {
                return resolve(connPool);
            }).catch(function (err) {
                connPoolPromise = null;
                __logger.error(err)
                return reject(err);
            });
        });

        return connPoolPromise;
    }


    /**
     * This function is used to run give SQL query
     * 
     * @param {any} sqlQuery 
     * @param {any} callback 
     */
    var query = function (sqlQuery, callback) {

        getConnPoolPromise().then(function (connPool) {

            var sqlRequest = new sql.Request(connPool);
            return sqlRequest.query(sqlQuery);

        }).then(function (result) {
            callback(null, result);
        }).catch(function (err) {
            __logger.error(err)
            return callback(err);
        });

    };

    module.exports = {
        'query': query,
        'getConnPoolPromise': getConnPoolPromise
    }

})()