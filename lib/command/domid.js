var altProperty = require('../../util/altproperty'),
    sanitize = require('../../util/sanitize');

module.exports = {
    'name': 'domid',
    'exec': function(options, callback) {
        var self = this;

        if(!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        // Map alternative properties to 'name'
        options = altProperty(options, 'name', ['domainName', 'domName']);

        if(!options.name) {
            return callback(new Error('domid: Missing required property \'name\' in options'));
        }

        // Sanitize domain name
        var name = sanitize.domName(options.name);

        this.executor.exec('xl', ['domid', name], function(err, data) {
            if(err) {
                return callback(err);
            }

            // Check if this DomU may be accessed
            // Do this check after the actual request to the server, so that one cannot guess if the domain exists from the response time of this method
            if(!self.filter(name)) {
                return callback(new Error('Can\'t get domid of domain name \'' + options.name + '\', maybe this domain does not exist.'))
            }

            if(data.stderr.length > 0 ) {
                return callback(new Error(data.stderr.toString('utf8').trim()));
            }

            var domId = data.stdout.toString('utf8').trim();
            return callback(null, parseInt(domId, 10));
        });
    }
};
