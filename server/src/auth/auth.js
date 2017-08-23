var users = require(__path.join(__base, 'auth', 'users.json'));

(function () {

    var getUserDetail = function (authDetail, callback) {
        __async.series([
            //Yours tasks here
            function (callback) {
                authenticateUser(authDetail, function (err, res) {
                    if (err)
                        return callback(err)
                    callback()
                })
            },
            function (callback) {
                getUserProducer(authDetail.user, function (err, res) {
                    if (err)
                        return callback(err)
                    authDetail.user = res
                    callback()
                })
            }
        ], function (err) {
            if (err) {
                callback(err, null)
            }

            callback(null, authDetail)
        })
    }


    /**
     * This function is used to authenticate the user and returns the user information along with status. This is a temporary methond until AD or Authentication mechanism is in place.
     * 
     * @param {any} authDetail 
     * @returns 
     */
    var authenticateUser = function (authDetail, callback) {
        var found = false;
        for (var user of users) {
            if (user.username == authDetail.user.username) {
                found = true;
                if (user.password != authDetail.user.password) {
                    __logger.warn("Invalid password for the user " + user.username)
                    callback("Invalid Password")
                }
                authDetail.user.name = user.name;
                authDetail.user.email = user.email;
                callback(null, authDetail)
            }
        }
        if (!found) {
            __logger.warn("User " + user.username + " not found.")
            callback("User not found.")
        }
    }

    var getUserProducer = function (user, callback) {
        var query = "select Producer_Code, User_Type_Ind, User_ID from USERS where Login_ID = '" + user.username + "'"

        __sqlutil.query(query, function (err, result) {
            if (err) {
                __logger.error(err)
                return callback(__constants.SYSTEM_ERROR)
            }

            if (result && result.recordset && result.recordset.length > 0) {
                __logger.info("Getting Producer Code for user: " + user.username)
                callback(null, populate_User_Info(user, result.recordset[0]))
            } else {
                callback(null, null)
            }
        })
    }

    var populate_User_Info = function (user, recordset) {

        user.userID = recordset['User_ID']
        user.userType = recordset['User_Type_Ind']
        user.producerCode = recordset['Producer_Code']
        return user
    }


    module.exports = {
        'authenticateUser': authenticateUser,
        'getUserDetail': getUserDetail
    }
})()