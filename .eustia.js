module.exports = {
  fione: {
    library: ['fione', 'node_modules/eustia-module'],
    files: 'src/**/*.js',
    output: 'src/lib/fione.js',
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
