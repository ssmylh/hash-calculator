'use strict'

var crypto = require('crypto');

var hash = {
    create: function(algorithm) {
        return crypto.createHash(algorithm);
    },
    calculate: function(hashes, blob, splitSize, callback) {
        var offset = 0,
            totalSize = blob.size,
            part = blob.slice(0, (totalSize > splitSize) ? splitSize : totalSize);

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
                if (remaining > splitSize) {
                    nextPart = blob.slice(offset, offset + splitSize);
                } else {
                    nextPart = blob.slice(offset, offset + remaining);
                }
                calculatePart(nextPart);
            };
            reader.readAsArrayBuffer(part);
        }
    }
};

module.exports = hash;
