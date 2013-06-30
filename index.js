require('./lib/alt');

var fs = require('fs'),
    cache = {};

function read(path, fn) {
    fs.readFile(path, 'utf8', function (err, data) {
        fn(alt('function(){' + data + '}'));
    });
}

function renderFile(path, options, fn) {
    if (typeof options == 'function') {
        fn = options, options = {};
    }

    options = options || {};
    options.cache = !!options.cache;
    if (options.cache) {
        var key = path + ':string';

        if (cache[key]) {
            fn(null, cache[key].render(options));
        } else {
            read(path, function (tpl) {
                cache[key] = tpl;
                fn(null, cache[key].render(options));
            });
        }
    } else {
        read(path, function (tpl) {
            fn(null, tpl.render(options));
        });
    }
}

exports.alt = alt;
exports.renderFile = exports.__express = renderFile;
