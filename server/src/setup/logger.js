(function () {
    var fs = require('fs');
    const stripAnsi = require('strip-ansi');

    var getLogger = function () {
        const errTemplate = "{{timestamp}} [{{title}}] - {{message}} (in {{file}}:{{line}})" + __os.EOL + "Call Stack:" + __os.EOL + "{{stack}}"
        var logger = require('tracer').dailyfile({
            logPathFormat: __path.join(__base, '../', __config.logger.logPath, __config.logger.logFile) + '.{{date}}.log',
            splitFormat: 'yyyymmdd',
            allLogsFileName: false,
            maxLogFiles: 10,
            level: __config.logger.level,
            format: [
                "{{timestamp}} [{{title}}] - {{message}} (in {{file}}:{{line}})", //default format
                {
                    error: errTemplate// error format
                }
            ],
            dateformat: "yyyy-mm-dd HH:MM:ss",
            transport: [
                function (data) {
                    console.log(data.output)
                }
            ]
        });
        return logger
    }

    module.exports = {
        "getLogger": getLogger
    }
})()