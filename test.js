var alt = require('./index');


alt.renderFile('examples/parent.alt', {
    b: 'testB'
}, function (err, html) {
    console.log(html);
});