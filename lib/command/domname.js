module.exports = {
    'name': 'domname',
    'exec': function(options, callback) {
        var self = this;

        if(!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        if(options.domainId) {
            options.id = options.domainId;
        }

        if(options.domId) {
            options.id = options.domId;
        }

        if(!options.id) {
            return callback(new Error('domname: Missing required property \'id\' in options'));
        }

        this.executor.exec('xl', ['domname', options.id], function(err, data) {
            if(err) {
                return callback(err);
            }

            var domName = data.stdout.toString('utf8').trim();

            // Check if this DomU may be accessed
            // Do this check after the actual request to the server, so that one cannot guess if the domain exists from the response time of this method
            if(!self.filter(domName)) {
                return callback(new Error('Can\'t get domain name of domain id \'' + options.id + '\', maybe this domain does not exist.'))
            }

            if(data.stderr.length > 0 ) {
                return callback(new Error(data.stderr.toString('utf8').trim()));
            }

            return callback(null, domName);
        });
    }
};
