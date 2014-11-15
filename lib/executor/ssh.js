// Requires
var SSHConnection = require("ssh2");

var SSHExecutor = function (options) {
    // Map verbose to ssh2 debug
    if (options.verbose) {
        this.options.debug = console.log;
    }

    this.options = options;
    this.debug = !!options.debug; // "cast" to boolean

    this.connection = null;
};

SSHExecutor.prototype.connect = function (callback) {
    var self = this;

    if (self.connection) {
        return callback();
    }

    var con = new SSHConnection();
    con.on('ready', function () {
        if (self.debug) {
            console.log('SSH %s: Connection successful', self);
        }

        self.connection = con;

        callback();
    }).on('error', function (err) {
        if (self.debug) {
            console.log('SSH %s: Connection failed: %s', self, err);
        }

        callback(err);

        // Prevent callback from being called more than once
        callback = function () {
        };
    });

    con.connect(self.options);
};

SSHExecutor.prototype.disconnect = function (callback) {
    var self = this;

    if (self.connection) {
        self.connection.end();
        self.connection = null;

        if (self.debug) {
            console.log('SSH %s: Connection closed', self);
        }

        callback();
    }
};

SSHExecutor.prototype.exec = function (command, cmdArgs, options, callback) {
    var args = Array.prototype.slice.call(arguments);

    if (!options && typeof cmdArgs === 'function') {
        args[2] = options = cmdArgs;
        args[1] = cmdArgs = [];
    }

    if (!callback && typeof options === 'function') {
        args[3] = callback = options;
        args[2] = options = {};
    }

    // Just append the command arguments to the command itself
    if (cmdArgs.length > 0) {
        command += ' ' + cmdArgs.join(' ');
    }

    var self = this;

    if (!self.connection) {
        return self.connect(function (err) {
            if (err) {
                return callback(err);
            }

            self.exec.apply(self, args);
        });
    }

    if (self.debug) {
        console.log('SSH %s: Send command %s', self.options.host + ':' + (self.options.port || '22'), command);
    }

    self.connection.exec(command, options, function (err, stream) {
        if (err) {
            return callback(err);
        }

        var data = {
            'stdout': [],
            'stderr': [],
            'code': null,
            'signal': null
        };

        var onFinished = (function () {
            var actual = 0, expected = 2;

            return function () {
                actual += 1;

                if (actual < expected) {
                    return;
                }

                callback(null, data);
            };
        })();

        stream.on('data', function (buf) {
            data.stdout.push(buf);
        }).on('error', function (err) {
            callback(err);

            // Prevent callback from being called more than once
            callback = function () {
            };
        }).on('close', function () {
            data.stdout = Buffer.concat(data.stdout);
        });

        stream.stderr.on('data', function (buf) {
            data.stderr.push(buf);
        }).on('error', function (err) {
            callback(err);

            // Prevent callback from being called more than once
            callback = function () {
            };
        }).on('close', function () {
            data.stderr = Buffer.concat(data.stderr);
        });

        stream.on('close', function () {
            if (self.debug) {
                console.log('SSH %s: Stream closed', self);
            }

            if (!self.options.persistent) {
                return self.disconnect(function (err) {
                    if (err) {
                        return callback(err);
                    }

                    onFinished();
                });
            }

            onFinished();
        }).on('exit', function (code, signal) {
            if (self.debug) {
                console.log('SSH %s: Command %s exited with code %d', self, command, code);
            }

            data.code = code;
            data.signal = signal;

            onFinished();
        });
    });
};

SSHExecutor.prototype.toString = function () {
    return (this.options.username ? this.options.username + '@' : '')
        + (this.options.host || 'Unknown host') + ':' + (this.options.port || 22);
};

module.exports = SSHExecutor;
