module.exports = {
    'name': 'shutdown',
    'exec': function(options, callback) {
        var self = this;

        if(!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        if(options.domainName) {
            options.name = options.domainName;
        }

        if(options.domName) {
            options.name = options.domName;
        }

        if(!options.name && !options.all) {
            return callback(new Error('shutdown: Missing required property \'name\' in options'));
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
        } else {
            // Sanitize domain name
            var name = self.sanitizeName(options.name);

            // Check if this DomU may be accessed
            if(!self.filter(name)) {
                return callback(new Error(options.name + ' is an invalid domain identifier (rc=-6)'))
            }

            this.executor.exec('xl', ['shutdown', name], function(err, data) {
                if(err) {
                    return callback(err);
                }

                // Shutdown response is printed on stderr - maybe a XEN bug?
                if(data.code === 0) {
                    return callback(null, data.stderr.toString('utf8').trim());
                } else {
                    return callback(new Error(data.stderr.toString('utf8').trim()));
                }
            });
        }
    }
};
