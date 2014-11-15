'use strict';

module.exports = function (obj, destName, altNames) {
    if (!obj || !destName || !altNames || !Array.isArray(altNames)) {
        return obj;
    }

    for (var i = 0, j = altNames.length; i < j; i++) {
        if (obj[destName]) {
            return obj;
        }

        if (obj[altNames[i]]) {
            obj[destName] = obj[altNames[i]];
        }
    }

    return obj;
};
