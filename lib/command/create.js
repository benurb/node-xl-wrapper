'use strict';

var sanitize = require('../../util/sanitize');

module.exports = {
    'name': 'create',
    'exec': function (options, callback) {
        var self = this;

        if (options.name && !self.configFileTemplate) {
            return callback(new Error('create: Name can only be used if a config file template is provided'));
        } else if (options.name && self.configFileTemplate) {
            options.file = self.configFileTemplate.replace('{{name}}', sanitize.domName(options.name));
        }

        // You can either supply a absolute path or a name that is used in the configTemplate
        if (!options.name && !options.file) {
            return callback(new Error('create: Missing required property \'name\' or \'file\''));
        }

        // Try to read the config file to check if the domain name is allowed
        self.executor.exec('cat', [options.file], {
            'noSudo': true
        }, function (err, data) {
            // Get name
            var nameFromConfig = data.stdout.toString('utf8').match(/name.*[\"\'](.*)[\"\']/i)[1];

            if (!nameFromConfig && self.executor.options.debug) {
                console.log('debug: Config file %s does not contain property name', options.file);
            }

            // Check if this DomU may be accessed
            if (err || !self.filter(nameFromConfig)) {
                return callback(new Error('Failed to read config file: ' + options.file + ': No such file or directory'));
            }

            var createArgs = ['create', options.file];

            if (options.pause) {
                createArgs.push('-p');
            }

            self.executor.exec('xl', createArgs, function (err, data) {
                if (err) {
                    return callback(err);
                }

                if (data.stderr.length > 0) {
                    return callback(new Error(data.stderr.toString('utf8').trim()));
                }

                return callback(null, data.stdout.toString('utf8').trim());
            });
        });
    }
};
