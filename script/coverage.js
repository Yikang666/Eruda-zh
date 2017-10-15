var path = require('path'),
    util = require('./util'),
    istanbul = require('istanbul');

var collector = new istanbul.Collector(),
    reporter = new istanbul.Reporter();

var remappedJson = require('../coverage/coverage-remapped.json');

var coverage = util.reduce(util.keys(remappedJson), function (result, source) 
{
    if (source.match(/src.*\.js$/) && source.indexOf('node_modules') < 0) 
    {
        var correctPath = source.replace(path.resolve(__dirname, '../src'), path.resolve(__dirname, '../'));

        var val = remappedJson[source];
        val.path = correctPath;
        result[correctPath] = val;
    }

    return result;
}, {});

collector.add(coverage);

reporter.addAll(['html', 'lcov']);
reporter.write(collector, true, function ()
{
    console.log('open coverage/index.html to see the coverage report.');
});