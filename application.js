'use strict'

window.$ = require('./js/lib/jquery-2.1.4.min.js');
window.jQuery = $;

$(function() {
var body = $(document.body);
var hash = require('./js/hash');
var algorithms = ['sha1', 'sha256', 'sha512', 'md5'];

var mask = $('<div></div>').css({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    'z-index': 999,
    display: 'none'
});
body.append(mask);

body.on('dragover', function(evt){
    evt.preventDefault();
    mask.show();
    $('#overlay').fadeIn(500);
});
mask.on('dragleave', function(evt){
    evt.preventDefault();
    mask.hide();
    $('#overlay').fadeOut(500);
});
mask.on('drop', function(evt){
    evt.preventDefault();
    mask.hide();
    $('#overlay').fadeOut(100);

    var checked = algorithms.filter((algorithm) => {
        return $('#' + algorithm).prop('checked');
    });
    if (checked.length === 0) {
        return;
    }

    var files = event.dataTransfer.files;
    Array.prototype.slice.apply(files).forEach((file) => {
        var hashes = checked.map((algorithm) => hash.create(algorithm));
        hash.calculate(
            hashes,
            file,
            (results) => showResults(file.name, file.size, checked.map((e, i) => [e, results[i]]))
        );
    });
});

function showResults(name, size, algorithmResultPairs) {
    var header = `<h5>${name}, ${size} bytes</h5>`;
    var content = `
        <table class="u-full-width">
            <thead>
                <tr>
                    <th>algorithm</th><th>hash</th>
                </tr>
            </thead>
            <tbody>`;
    algorithmResultPairs.forEach(ar => {
        content += `
                <tr>
                    <td>${ar[0].toUpperCase()}</td>
                    <td>${ar[1]}</td>
                </tr>`;
    });
    content += `
            </tbody>
        </table>`;
    $('#results').prepend($(header + content));
}
});