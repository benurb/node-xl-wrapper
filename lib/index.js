var fs = require('fs'),
    path = require('path');

var XL = function (options) {
    'use strict';

    if (!options || typeof options !== 'object' || !options.executorName) {
        throw new Error('Cannot initialize XL lib without executor');
    }

    // Bind executor
    var Executor;
    try {
        Executor = require('./executor/' + options.executorName);
    } catch (e) {
        throw new Error('XL: Cannot find executor ' + options.executorName);
    }

    this.executor = new Executor(options.executorOptions || {});

    // Bind filter
    if (options.filter instanceof RegExp) {
        this.filter = function (domUName) {
            return options.filter.test(domUName);
        };
    } else if (typeof options.filter === 'string') {
        this.filter = function (domUName) {
            return domUName.toLowerCase() === options.filter.toLowerCase();
        };
    } else {
        this.filter = function () {
            return true;
        };
    }

    if (options.configFileTemplate) {
        this.configFileTemplate = options.configFileTemplate;
    }
};

// Bind commands
var commands = fs.readdirSync(path.join(__dirname, 'command'));
for (var i = 0, j = commands.length; i < j; i++) {
    var command = require(path.join(__dirname, 'command', commands[i]));

    XL.prototype[command.name] = command.exec;
}

module.exports = XL;
