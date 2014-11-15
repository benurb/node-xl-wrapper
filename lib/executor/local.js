var child_process = require('child_process');

var LocalExecutor = function (options) {
    this.options = options;
    this.debug = !!(options.debug || options.verbose); // "cast" to boolean - debug and verbose are identical here
};

LocalExecutor.prototype.exec = function (command, cmdArgs, options, callback) {
    if (!options && typeof cmdArgs === 'function') {
        options = cmdArgs;
        cmdArgs = [];
    }

    if (!callback && typeof options === 'function') {
        callback = options;
        options = {};
    }

    var data = {
        'stdout': [],
        'stderr': [],
        'code': null,
        'signal': null
    };

    if(self.options.sudo) {
        // Add sudo as command, the rest as arguments
        cmdArgs = [command].concat(cmdArgs);
        command = 'sudo';
    }

    var proc = child_process.spawn(command, cmdArgs, options).on('error', function (err) {
        callback(err);

        // Prevent callback from being called more than once
        callback = function () {
        };
    }).on('exit', function (code, signal) {
        data.code = code;
        data.signal = signal;
    }).on('close', function () {
        callback(null, data);
    });

    proc.stdout.on('data', function (buf) {
        data.stdout.push(buf);
    }).on('error', function (err) {
        callback(err);

        // Prevent callback from being called more than once
        callback = function () {
        };
    }).on('close', function () {
        data.stdout = Buffer.concat(data.stdout);
    });

    proc.stderr.on('data', function (buf) {
        data.stderr.push(buf);
    }).on('error', function (err) {
        callback(err);

        // Prevent callback from being called more than once
        callback = function () {
        };
    }).on('close', function () {
        data.stderr = Buffer.concat(data.stderr);
    });
};

module.exports = LocalExecutor;
