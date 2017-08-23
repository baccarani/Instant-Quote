(function () {
    var staticData = require(__path.join(__base, 'dot', 'static-data.js'))

    /**
     * This function is used to run Initial Declination rule for the given Quest object. It runs the rule serially and set the status of the Quest object.
     * 
     * @param {any} quest 
     * @param {any} callback 
     */
    var runInitialDeclinationRules = function (quest, callback) {
        var cntyCode = null;
        __async.series([
            function (callback) {
                if (quest.initialEligibility.applicantInfo.vehicleType != null && quest.initialEligibility.applicantInfo.vehicleType != "T") {
                    quest.declined = "Y"
                    quest.declinedMsg = ""
                }
                callback()
            },
            function (callback) {
                if (quest.declined != "Y" && quest.initialEligibility.applicantInfo.hasDOTRevoked == "Y") {
                    quest.declined = "Y"
                    quest.declinedMsg = ""
                }
                callback()
            },
            function (callback) {
                if (quest.declined != "Y" && quest.initialEligibility.passengerInd == "Y") {
                    quest.declined = "Y"
                    quest.declinedMsg = ""
                }
                callback()
            },
            function (callback) {
                if (quest.declined != "Y") {
                    staticData.getStaticDataByKey(__constants.ZIP_DECLINATION, function (err, res) {
                        if (err)
                            return callback(err, quest)
                        if (res.some(function (zipFromList) {
                            return zipFromList.ZIP == quest.initialEligibility.applicantInfo.zip
                        })) {
                            quest.declined = "Y"
                            quest.declinedMsg = ""
                        }
                        callback()
                    })
                } else {
                    callback()
                }
            },
            function (callback) {
                if (quest.declined != "Y") {
                    staticData.getStaticDataByKey(__constants.ZIP_COUNTY_MAP, function (err, res) {
                        if (err)
                            return callback(err, quest)
                        cntyCode = res.find(function (zipCntMap) {
                            return zipCntMap.zip == quest.initialEligibility.applicantInfo.zip
                        })
                        callback()
                    })
                } else {
                    callback()
                }
            },
            function (callback) {
                if (quest.declined != "Y") {
                    staticData.getStaticDataByKey(__constants.COUNTY_DECLINATION, function (err, res) {
                        if (err)
                            return callback(err, quest)
                        if (res.some(function (cntyFromList) {
                            return cntyFromList.cntyCode == cntyCode
                        })) {
                            quest.declined = "Y"
                            quest.declinedMsg = ""
                        }
                        callback()
                    })
                } else {
                    callback()
                }
            },
        ], function (err) {
            if (err)
                return callback(err, quest)
            callback(err, quest)
        })
    }

    module.exports = {
        "runInitialDeclinationRules": runInitialDeclinationRules
    }
}())