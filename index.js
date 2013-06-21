require('./lib/alt');

var fs = require('fs'),
    cache = {};

function read(path, fn) {
    fs.readFile(path, 'utf8', function (err, data) {
        var tpl = alt('function(){' + data + '}');
        tpl.lineSep = "\n";
        fn(tpl);
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
            cache[key] = tpl;
            fn(null, cache[key].render(options));
        });
    }
}

exports.alt = alt;
exports.renderFile = exports.__express = renderFile;

console.log('Rendering ' + process.argv[2] + "...\n\n");
renderFile(process.argv[2], {
    list: {
        persons: [
            [
                {id: 1, name: 'Cathy'  , lastName: 'Gutierrez'},
                {id: 2, name: 'Don'    , lastName: 'Cohen'},
                {id: 3, name: 'Leigh'  , lastName: 'Frazier'}
            ],
            [
                {id: 4, name: 'Leland' , lastName: 'Holt'},
                {id: 5, name: 'Harold' , lastName: 'Norton'},
                {id: 6, name: 'Edmund' , lastName: 'Bass'}
            ],
            [
                {id: 7, name: 'Tracey' , lastName: 'Anderson'},
                {id: 8, name: 'Ron'    , lastName: 'Barton'},
                {id: 9, name: 'Lorenzo', lastName: 'Hardy'}
            ]
        ]
    },
    let: {
        a: {
            b: 5
        }
    }
}, function (err, str) {
    console.log(str);
    console.log('');
})