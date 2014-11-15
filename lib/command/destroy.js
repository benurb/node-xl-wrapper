'use strict';

var altProperty = require('../../util/altproperty'),
    sanitize = require('../../util/sanitize');

module.exports = {
    'name': 'destroy',
    'exec': function(options, callback) {
        var self = this;

        if(!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        // Map alternative properties to 'id'
        options = altProperty(options, 'id', ['domainId', 'domId']);

        // Map alternative properties to 'name'
        options = altProperty(options, 'name', ['domainName', 'domName']);

        if(!options.name && !options.id) {
            return callback(new Error('destroy: Missing required property \'name\' or \'id\' in options'));
        }

        if(options.name && options.id) {
            return callback(new Error('destroy: You may supply \'name\' or \'id\' not both'));
        }

        if(options.name) {
            // Sanitize domain name
            var name = sanitize.domName(options.name);

            // Check if this DomU may be accessed
            if(!self.filter(name)) {
                return callback(new Error(options.name + ' is an invalid domain identifier (rc=-6)'));
            }

            self.executor.exec('xl', ['destroy', name], function(err, data) {
                if(err) {
                    return callback(err);
                }

                if(data.code === 0) {
                    // Destroy doesn't return anything
                    return callback(null, data.stderr.toString('utf8').trim());
                } else {
                    return callback(new Error(data.stderr.toString('utf8').trim()));
                }
            });
        } else if(options.id) {
            // Sanitize domain id
            var id = sanitize.domId(options.id);

            // Empty string (means sanitize failed) or 0 are not supported
            if(!id) {
                return callback(new Error('Invalid DomU id'));
            }

            // Get Dom name to check the filter
            self.domname({
                'id': id,
                'skipFilter': true // Skip filtering in domname to return an accurate error message here
            }, function(err, domName) {
                if(err && self.executor.options.debug) {
                    console.log('Debug: Error thrown by domname:', err);
                }

                // Check if this DomU may be accessed
                if(err || !self.filter(domName)) {
                    return callback(new Error('libxl: error: libxl.c:1384:libxl__destroy_domid: non-existant domain ' + options.id + '\n' +
                    'libxl: error: libxl.c:1348:domain_destroy_callback: unable to destroy guest with domid ' + options.id + '\n' +
                    'libxl: error: libxl.c:1275:domain_destroy_cb: destruction of domain ' + options.id + ' failed\n' +
                    'destroy failed (rc=-6)'));
                }

                // To prevent code duplication, call the shutdown logic itself, this time with the name property set
                self.destroy({
                    'name': domName
                }, callback);
            });
        }
    }
};
