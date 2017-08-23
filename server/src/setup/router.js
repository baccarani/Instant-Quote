var express = require('express');        // call express
var multer = require('multer');
var app = express();
var fs = require('fs');
var mkdirp = require('mkdirp');

var userVerify = require(__path.join(__base, 'auth', 'auth.js'));
var staticData = require(__path.join(__base, 'dot', 'static-data.js'));
var factory = require(__path.join(__base, 'factory', 'factory.js'));
var util = require(__path.join(__base, 'util', 'util.js'));
var dot = require(__path.join(__base, 'dot', 'dot.js'));
var version1 = require(__path.join(__base, 'dot', 'dot.js'));
var ILFs = require(__path.join(__base, 'dot', 'dot.js'));
var units = require(__path.join(__base, 'dot', 'dot.js'));

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        var dest = __config.node.upload.upload_path + __config.node.upload.upload_dir;
        mkdirp.sync(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname.substring(0, file.originalname.lastIndexOf('.')) + "_" + datetimestamp + file.originalname.substring(file.originalname.lastIndexOf('.')));
    }
});

var upload = multer({ //multer settings
    storage: storage
}).any();

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}

router.get('/', function (req, res) {
    //res.json({ message: 'Welcome to Quest App Node Server' });
    /*dot.getDOTData(1649262, function (err, result) {
        res.json(result)
    })
    */

    /* staticData.getVehicleInfo(function (err, result) {
        res.json(result)
    }) */

    dot.checkDOTExists(1649262, function (err, result) {
        if (err)
            res.json(err)
        else
            res.json(result)
    })
});

router.post('/login', function (req, res) {
    var authDetail = req.body;
    var result = userVerify.getUserDetail(authDetail, function (err, result) {
        if (err)
            res.json(JSON.stringify({ error: err }))
        else
            res.json(JSON.stringify(result))
    });
});

router.post('/loadStaticData', function (req, res) {
    var authDetail = req.body;
    staticData.getAllStaticData(function (err, result) {
        if (err)
            res.json(JSON.stringify({ error: err }))
        else
            res.json(JSON.stringify(result))
    })
});

router.post('/getDOTData', function (req, res) {
    var dotNumber = req.body;
    dot.getDOTData(req.body['dotNum'], function (err, result) {
        if (err)
            res.json(JSON.stringify({ error: err }))
        else
            res.json(JSON.stringify(result))
    })
});

router.post('/generateQuote', function (req, res) {
    var quest = req.body;
    dot.generateQuote(quest, function (err, questWithPricingObj) {
        if (err)
            res.json(JSON.stringify({ error: err }))
        else
            res.json(JSON.stringify(questWithPricingObj))
    })
});

/******************************** Upload Routes ****************************************************/

//Will be called as soon as file is uploaded to the client.
router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (req.files && req.files.length > 0) {
            for (file of req.files) {
                //save the file locally and send the file name and location so that client can send it in the next request to process the file.
                res.json(JSON.stringify({ valid: true, message: { fileName: file.filename, filePath: file.path } }));
            }
        }
    });
});

module.exports = router;