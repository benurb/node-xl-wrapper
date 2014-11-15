var altProperty = require('../../util/altproperty'),
    sanitize = require('../../util/sanitize');

module.exports = {
    'name': 'domname',
    'exec': function(options, callback) {
        var self = this;

        if(!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        // Map alternative properties to 'id'
        options = altProperty(options, 'id', ['domainId', 'domId']);

        if(!options.id) {
            return callback(new Error('domname: Missing required property \'id\' in options'));
        }

        // Sanitize id
        var id = sanitize.domId(options.id);

        this.executor.exec('xl', ['domname', id], function(err, data) {
            if(err) {
                return callback(err);
            }

            var domName = data.stdout.toString('utf8').trim();

            // Check if this DomU may be accessed
            // Do this check after the actual request to the server, so that one cannot guess if the domain exists from the response time of this method
            // For internal use the filter may actually be skipped
            if(!self.filter(domName) && !options.skipFilter) {
                return callback(new Error('Can\'t get domain name of domain id \'' + options.id + '\', maybe this domain does not exist.'))
            }

            if(data.stderr.length > 0 ) {
                return callback(new Error(data.stderr.toString('utf8').trim()));
            }

            return callback(null, domName);
        });
    }
};
