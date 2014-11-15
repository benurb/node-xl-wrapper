module.exports = {
    'name': 'list',
    'exec': function(options, callback) {
        var self = this;

        if(!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }

        this.executor.exec('xl', ['list', '-l'], function(err, data) {
            if(err) {
                return callback(err);
            }

            var list = JSON.parse(data.stdout.toString('utf8'));

            // Filter
            list = list.filter(function(elem) {
                return self.filter(elem.config['c_info'].name);
            });

            return callback(null, list);
        });
    }
};
