var modernizr = require('modernizr'),
    fs = require('fs');

var featureList = require('./featureList.json');

modernizr.build(featureList, function (result)
{
    result = result.replace(';(function(window, document, undefined){', '')
                   .replace('window.Modernizr = Modernizr;', '')
                   .replace('testRunner();', 'Modernizr.testRunner = testRunner;')
                   .replace('})(window, document);', '');
    result += '\nmodule.exports = Modernizr;';
    fs.writeFile('./modernizr.js', result, 'utf8');
});