(function () {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    var timeout = require('connect-timeout');
    //Our Router information is here.
    var routes = require(__path.join(__base, 'setup', 'router.js'))

    // configure app to use bodyParser() to get data from POST request    
    app.use(bodyParser.urlencoded({ limit: __config.node.maxPayLoad, extended: true }));
    app.use(bodyParser.json({ limit: __config.node.maxPayLoad }));
    app.use(timeout(__config.node.req_timeout));

    app.use(function (req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        var allowedOrigins = __config.node.allowed_origin;
        var origin = req.headers.origin;
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        res.socket.setTimeout(__config.node.res_timeout);
        if (!req.timedout)
            next();
    });

    var port = process.env.PORT || __config.node.port;        // set our port

    // REGISTER OUR ROUTES
    app.use('/', routes);

    //Error handling
    app.use(function (err, req, res, next) {
        __logger.error(err)
        res.status(500).send({ error: err })
    })

    // START THE SERVER
    // =============================================================================
    app.listen(port);
    __logger.info('Server is running on port ' + port);
})()