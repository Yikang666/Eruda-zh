const webfontsGenerator = require('webfonts-generator')
const fs = require('licia/fs')
const map = require('licia/map')
const filter = require('licia/filter')
const endWith = require('licia/endWith')
const promisify = require('licia/promisify')
const path = require('path')

const generate = promisify(webfontsGenerator)

async function main() {
  const iconDir = path.resolve(__dirname, '../src/style/icon')
  let files = await fs.readdir(iconDir)
  files = filter(files, file => endWith(file, '.svg'))
  const dest = path.resolve(__dirname, './icon')
  const result = await generate({
    files: map(files, file => iconDir + '/' + file),
    types: ['woff'],
    cssTemplate: iconDir + '/cssTemplate.hbs',
    dest,
    writeFiles: false
  })
  const iconData = result.woff.toString('base64')
  const css = result.generateCss({
    woff: 'data:application/x-font-woff;charset=utf-8;base64,' + iconData
  })
  await fs.writeFile(
    path.resolve(__dirname, '../src/style/icon.css'),
    css,
    'utf8'
  )
}

main()
