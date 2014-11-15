var altProperty = require('../../util/altproperty'),
    sanitize = require('../../util/sanitize');

module.exports = {
    'name': 'shutdown',
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

        if(!options.name && !options.id && !options.all) {
            return callback(new Error('shutdown: Missing required property \'name\' or \'id\' in options'));
        }

        if(options.name && options.id) {
            return callback(new Error('shutdown: You may supply \'name\' or \'id\' not both'));
        }

        if(options.all) {
            // Shutdown all vms - so first check if the filter grants permission to all runnig VMs
            this.executor.exec('xl', ['list', '-l'], function(err, data) {
                if (err) {
                    return callback(err);
                }

                var list = JSON.parse(data.stdout.toString('utf8'));
                list = list.map(function(elem) {
                    return elem.config['c_info'].name;
                });

                filteredList = list.filter(function(elem) {
                    return self.filter(elem);
                });

                if(list.length !== filteredList.length) {
                    return callback(new Error('Not allowed to shutdown all VMs'));
                }

                this.executor.exec('xl', ['shutdown', '-a'], function(err, data) {
                    if(err) {
                        return callback(err);
                    }

                    if(data.stderr.length > 0 ) {
                        return callback(new Error(data.stderr.toString('utf8').trim()));
                    }

                    return callback(null, data.stdout.trim());
                });
            })
        } else if(options.name) {
            // Sanitize domain name
            var name = sanitize.domName(options.name);

            // Check if this DomU may be accessed
            if(!self.filter(name)) {
                return callback(new Error(options.name + ' is an invalid domain identifier (rc=-6)'))
            }

            this.executor.exec('xl', ['shutdown', name], function(err, data) {
                if(err) {
                    return callback(err);
                }

                // Shutdown response is printed on stderr - maybe a XEN bug?
                if(data.code === 0 && data.stdout.length === 0) {
                    return callback(null, data.stderr.toString('utf8').trim());
                } else if(data.stderr.length === 0 && data.stdout.length > 0) {
                    return callback(null, data.stdout.toString('utf8').trim());
                } else {
                    return callback(new Error(data.stderr.toString('utf8').trim()));
                }
            });
        } else if(options.id) {
            // Sanitize domain name
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
                if(err) {
                    return callback(err);
                }

                // Check if this DomU may be accessed
                if(!self.filter(domName)) {
                    return callback(new Error('Shutting down domain ' + options.id + '\n'
                    + 'libxl: error: libxl_dom.c:35:libxl__domain_type: unable to get domain type for domid=' + options.id + '\n'
                    + 'shutdown failed (rc=-3)'))
                }

                // To prevent code duplication, call the shutdown logic itself, this time with the name property set
                self.shutdown({
                    'name': domName
                }, callback);
            });
        }
    }
};
