var DummyExecutor = function (options) {
    this.options = options;
};

DummyExecutor.prototype.exec = function (command, cmdArgs, options, callback) {
    if (!options && typeof cmdArgs === 'function') {
        options = cmdArgs;
        cmdArgs = [];
    }

    if (!callback && typeof options === 'function') {
        callback = options;
        options = {};
    }

    // Just use the arguments as command
    command = cmdArgs.join(' ');

    var self = this;
    var base = self.options.mock[command] || {
        'err': null,
        'data': null
    };

    callback(base.err, base.data);
};

module.exports = DummyExecutor;
