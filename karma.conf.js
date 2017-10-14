var webpackCfg = require('./script/webpack.dev');
webpackCfg.devtool = 'inline-source-map';

module.exports = function (config)
{
    config.set({
        basePath: '',
        frameworks: ['jquery-1.8.3'],
        files: [
            'src/index.js',
            'test/init.js',
            'node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
            'node_modules/karma-jasmine/lib/boot.js',
            'node_modules/karma-jasmine/lib/adapter.js',
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
            'test/console.js',
            'test/elements.js',
            'test/features.js',
            'test/info.js',
            'test/network.js',
            'test/resources.js',
            'test/snippets.js',
            'test/sources.js',
            'test/settings.js'
        ],
        plugins: [
            'karma-jasmine',
            'karma-jquery',
            'karma-phantomjs-launcher',
            'karma-wrap-preprocessor',
            'karma-coverage',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-sourcemap-writer'
        ],
        webpackServer: {
            noInfo: true
        },
        preprocessors: {
            'test/*.js': ['wrap'],
            'src/index.js': ['webpack', 'sourcemap', 'sourcemap-writer', 'coverage']
        },
        webpack: webpackCfg,
        wrapPreprocessor: {
            template: '(function () { <%= contents %> })()'
        },
        coverageReporter: {
            type: 'json',
            subdir: '.',
            file: 'coverage-final.json'
        },
        reporters: ['progress', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: true,
        concurrency: Infinity
    });
};
