'use strict';

module.exports = {
    'domName': function (name) {
        return name.replace(/([^a-zA-Z0-9])/g, '\\$1'); // Escape any special characters - this is ok for bash
    },
    'domId': function (id) {
        var numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return '';
        }

        return numericId;
    }
};
