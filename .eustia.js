module.exports = {
  eruda: {
    library: ['fione', 'node_modules/eustia-module'],
    files: 'src/**/*.js',
    ignore: 'src/**/stringify.js',
    output: 'src/lib/util.js',
    exclude: ['createCfg'],
    format: 'es',
  },
  test: {
    library: ['node_modules/eustia-module'],
    files: ['test/*.js', 'test/*.html'],
    exclude: ['js'],
    namespace: 'util',
    output: 'test/util.js',
  },
}
