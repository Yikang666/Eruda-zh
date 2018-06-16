module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    worker: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
    VERSION: true,
    ENV: true
  },
  rules: {
    quotes: [
      'error',
      'single'
    ]
  }
}