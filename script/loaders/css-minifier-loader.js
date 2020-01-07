const cssMap = require('../../src/lib/cssMap')
const escapeRegExp = require('licia/escapeRegExp')
const each = require('licia/each')

module.exports = function (src) {
    each(cssMap, (val, key) => {
        src = src.replace(new RegExp(escapeRegExp(';' + key + ':'), 'g'), ';$' + val + ':')
        src = src.replace(new RegExp(escapeRegExp('{' + key + ':'), 'g'), '{$' + val + ':')
    })    

    return src
}