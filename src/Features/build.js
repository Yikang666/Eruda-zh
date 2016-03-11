var modernizr = require('modernizr'),
    fs = require('fs');

var featureList = require('./featureList.json');

modernizr.build(featureList, function (result)
{
    result += '\nmodule.exports = Modernizr;';
    fs.writeFile('./modernizr.js', result, 'utf8');
});