module.exports = {
  test: {
    library: ['node_modules/eustia-module'],
    files: ['test/*.js', 'test/*.html'],
    exclude: ['js'],
    namespace: 'util',
    output: 'test/util.js',
  },
}
