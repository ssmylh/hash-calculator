'use strict'

var crypto = require('crypto');

var hash = {
    create: function(algorithm) {
        return crypto.createHash(algorithm);
    },
    calculate: function(hashes, file, callback) {
        var offset = 0,
            unit = 1 * 1024 * 1024,
            totalSize = file.size,
            part = file.slice(0, (totalSize > unit) ? unit : totalSize);

        calculatePart(part);
        function calculatePart(part) {
            var reader = new FileReader();
            reader.onload = function(evt) {
                var buffer = new Buffer(evt.target.result);
                hashes.forEach((hash) => hash.update(buffer));

                offset += part.size;
                if (offset >= totalSize) {
                    callback(hashes.map((hash) => hash.digest('hex')));
                    return;
                }

                var nextPart;
                var remaining = totalSize - offset;
                if (remaining > unit) {
                    nextPart = file.slice(offset, offset + unit);
                } else {
                    nextPart = file.slice(offset, offset + remaining);
                }
                calculatePart(nextPart);
            };
            reader.readAsArrayBuffer(part);
        }
    }
};

module.exports = hash;
