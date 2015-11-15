var assert = require('assert');
var fs = require("fs");
var hash = require('../js/hash');

// Test the following for renderer process,
// using electron-mocha (https://github.com/jprichardson/electron-mocha).
describe('hash', () => {
    describe('#calculate', () => {
        it('should calculate from blob in multiple algorithms', (done) => {
            var message = 'abcdefghijklmnopqrstuvwxyz';
            var sha1 = '32d10c7b8cf96570ca04ce37f2a19d84240d3a89';
            var md5 = 'c3fcd3d76192e4007dfb496cca67e13b';

            var blob = new Blob([message], { type: 'text/html' });
            var hashes = [hash.create('sha1'), hash.create('md5')];

            hash.calculate(
                hashes,
                blob,
                512,
                (results) => {
                    assert(results[0] === sha1);
                    assert(results[1] === md5);
                    done();
                }
            );
        });
        it('should calculate from blob whose size is less than split-size', (done) => {
            var buffer = fs.readFileSync(__dirname + '/resources/less-than-1kb.txt');
            var blob = new Blob([toArrayBuffer(buffer)]);
            var sha1 = 'fd2de7f854e057cfd2f6360af5636409f41d9de1';

            hash.calculate(
                [hash.create('sha1')],
                blob,
                1024,
                (results) => {
                    assert(results[0] === sha1);
                    done();// wait.
                }
            );
        });
        it('should calculate from blob whose size is more than split-size', (done) => {
            var buffer = fs.readFileSync(__dirname + 'test/resources/more-than-4kb.txt');
            var blob = new Blob([toArrayBuffer(buffer)]);
            var sha1 = '2d05c8e1f9bbdda383f9f77d43cbbfc6de474587';
            hash.calculate(
                [hash.create('sha1')],
                blob,
                1024,
                (results) => {
                    assert(results[0] === sha1);
                    done();// wait.
                }
            );
        });
        // Helper function which converts Buffer -> ArrayBuffer.
        function toArrayBuffer(buffer) {
            var ab = new ArrayBuffer(buffer.length);
            var view = new Uint8Array(ab);
            for (var i = 0; i < buffer.length; ++i) {
                view[i] = buffer[i];
            }
            return ab;
        }
    });
});