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
    light: '#ccc',
    dark: '#aaa'
  })
}

function createLightTheme(theme) {
  return extend(theme, {
    consoleWarnBackground: '#fffbe5',
    consoleWarnForeground: '#5c5c00',
    consoleWarnBorder: '#fff5c2',
    consoleErrorBackground: '#fff0f0',
    consoleErrorForeground: '#f00',
    consoleErrorBorder: '#ffd6d6',
    light: '#fff',
    dark: '#eee'
  })
}

const themes = {
  Light: createLightTheme({
    darkerBackground: '#f3f3f3',
    background: '#fff',
    foreground: '#333',
    selectForeground: '#333',
    accent: '#1a73e8',
    highlight: '#eaeaea',
    active: '#aaa',
    border: '#ccc',
    primary: '#333',
    contrast: '#f2f7fd',
    varColor: '#c80000',
    stringColor: '#1a1aa6',
    keywordColor: '#0d22aa',
    numberColor: '#1c00cf',
    operatorColor: '#808080',
    linkColor: '#1155cc',
    textColor: '#8097bd',
    tagNameColor: '#881280',
    functionColor: '#222',
    attributeNameColor: '#994500',
    commentColor: '#236e25',
    cssProperty: '#c80000'
  }),
  Dark: createDarkTheme({
    darkerBackground: '#333',
    background: '#242424',
    foreground: '#a5a5a5',
    selectForeground: '#eaeaea',
    accent: '#555',
    highlight: '#000',
    active: '#555',
    border: '#3d3d3d',
    primary: '#ccc',
    contrast: '#0b2544',
    varColor: '#e36eec',
    stringColor: '#f29766',
    keywordColor: '#9980ff',
    numberColor: '#9980ff',
    operatorColor: '#7f7f7f',
    linkColor: '#ababab',
    textColor: '#42597f',
    tagNameColor: '#5db0d7',
    functionColor: '#d5d5d5',
    attributeNameColor: '#9bbbdc',
    commentColor: '#747474',
    cssProperty: '#35d4c7'
  }),
  'Material Oceanic': createDarkTheme({
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
    commentColor: '#546e7a',
    cssProperty: '#35d4c7'
  })
}

let curTheme = themes.Light

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
    curTheme = themes[theme] || themes.Light
  } else {
    curTheme = defaults(theme, themes.Light)
  }

  resetStyles()
}

exports.getCurTheme = () => curTheme

exports.getThemes = () => themes

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
  const _keys = keys(themes.Light)
  each(_keys, key => {
    css = css.replace(
      new RegExp(`var\\(--${kebabCase(key)}\\)`, 'g'),
      curTheme[key]
    )
  })
  el.innerText = css
}
