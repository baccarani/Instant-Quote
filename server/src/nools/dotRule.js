/*(function () {
    var nools = require('nools');
    var ruleFilePath = __base + 'nools/dotRules.nools'
    var flow = nools.compile(ruleFilePath);

    var initEl = {
        "declined": "",
        "dot": "1649262",
        "effDate": null,
        "expDate": null,
        "yearInBus": null,
        "safetyRating": null,
        "primaryALLimit": null,
        "primaryAGLimit": null,
        "primaryELLimit": null,
        "isUnschdVehicle": null,
        "isSrvcProvdOrCommodHauled": null,
        "isCglClass": null,
        "applicantInfo": {
            "applicantName": "DONALD KALEB STOUFER",
            "zip": "65020",
            "hasDOTRevoked": "N",
            "state": {
                "id": null,
                "code": "MO",
                "name": null
            },
            "vehicleType": "T",
            "garbageHaul": ""
        }
    }

    var zipDeclinationJSON = require(__base + 'json/ZipDeclination.json')

    var zipCountyMapJSON = require(__base + 'json/ZipCountyMap.json')

    var countyDeclinationJSON = require(__base + 'json/CountyDeclination.json')

    //Flow class

    var InitElg = flow.getDefined("initialEligibility")

    var ZipDeclination = flow.getDefined("zipdeclination")

    var CountyDeclination = flow.getDefined("countydeclination")

    var ZipCountyMap = flow.getDefined("zipcountymap")

    //Nools obj to insert into session

    var initElgNoolsObj = new InitElg(initEl, "")

    var zipDeclNoolsObj = new ZipDeclination(zipDeclinationJSON)

    var zipCountyMapNoolsObj = new ZipCountyMap(zipCountyMapJSON)

    var countyDeclNoolsObj = new CountyDeclination(countyDeclinationJSON)

    var session = flow.getSession(initElgNoolsObj, zipDeclNoolsObj, zipCountyMapNoolsObj, countyDeclNoolsObj);
    //var Message = flow.getDefined("message");

    //session.assert(new Message("hello"));
    //session.assert(new Message("hello or goodbye"));
    //session.assert(new Message("hello world"));
    //session.assert(new Message("goodbye"));

    session.match().then(function () {
        session.dispose();
    });
}())*/