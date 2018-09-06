module.exports = {
  script: {
    files: 'script/*.js',
    output: 'script/util.js',
    format: 'commonjs'
  },
  eruda: {
    library: 'https://raw.githubusercontent.com/liriliri/fione/master/',
    files: 'src/**/*.js',
    ignore: 'src/**/stringify.js',
    output: 'src/lib/util.js',
    exclude: ['createCfg'],
    format: 'es'
  },
  stringify: {
    files: 'src/lib/stringify.js',
    output: 'src/lib/stringifyUtil.js',
    format: 'es'
  },
  test: {
    files: ['test/*.js', 'test/*.html'],
    exclude: ['js'],
    namespace: 'util',
    output: 'test/util.js'
  }
}
