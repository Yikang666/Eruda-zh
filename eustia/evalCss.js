/* Eval css.
 */

_('toStr each filter isStr keys kebabCase defaults extend')

let styleList = []
let scale = 1

function createDarkTheme(theme) {
  return extend(theme, {
    consoleWarnBackground: '#332a00',
    consoleWarnForeground: '#ffcb6b',
    consoleWarnBorder: '#650',
    consoleErrorBackground: '#290000',
    consoleErrorForeground: '#ff8080',
    consoleErrorBorder: '#5c0000',
    cssProperty: '#35d4c7'
  })
}

const themes = {
  default: createDarkTheme({
    darkerBackground: '#212c31',
    background: '#263238',
    foreground: '#b0b1c5',
    selectForeground: '#fff',
    accent: '#009688',
    highlight: '#425b67',
    active: '#314549',
    border: '#2a373e',
    primary: '#607d8b',
    contrast: '#1e272c',
    varColor: '#eff',
    stringColor: '#c3e88d',
    keywordColor: '#c792ea',
    numberColor: '#f78c6c',
    operatorColor: '#89ddff',
    linkColor: '#80cbc4',
    textColor: '#c3cee3',
    tagNameColor: '#f07178',
    functionColor: '#82aaff',
    attributeNameColor: '#ffcb6b',
    linkColor: '#80cbc4',
    commentColor: '#546e7a'
  })
}

let curTheme = themes.default

exports = function(css, container) {
  css = toStr(css)

  for (let i = 0, len = styleList.length; i < len; i++) {
    if (styleList[i].css === css) return
  }

  container = container || exports.container || document.head
  const el = document.createElement('style')

  el.type = 'text/css'
  container.appendChild(el)

  let style = { css, el, container }
  resetStyle(style)
  styleList.push(style)

  return style
}

exports.setScale = function(s) {
  scale = s
  resetStyles()
}

exports.setTheme = function(theme) {
  if (isStr(theme)) {
    curTheme = themes[theme] || themes.default
  } else {
    curTheme = defaults(theme, themes.default)
  }

  resetStyles()
}

exports.getCurTheme = function() {
  return curTheme
}

exports.clear = function() {
  each(styleList, ({ container, el }) => container.removeChild(el))
  styleList = []
}

exports.remove = function(style) {
  styleList = filter(styleList, s => s !== style)

  style.container.removeChild(style.el)
}

function resetStyles() {
  each(styleList, style => resetStyle(style))
}

function resetStyle({ css, el }) {
  css = css.replace(/(\d+)px/g, ($0, $1) => +$1 * scale + 'px')
  const _keys = keys(themes.default)
  each(_keys, key => {
    css = css.replace(
      new RegExp(`var\\(--${kebabCase(key)}\\)`, 'g'),
      curTheme[key]
    )
  })
  el.innerText = css
}
