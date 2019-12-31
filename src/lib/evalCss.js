import {
  toStr,
  each,
  filter,
  isStr,
  keys,
  kebabCase,
  defaults,
  extend
} from './util'

let styleList = []
let scale = 1

function createDarkTheme(theme) {
  if (!theme.darkerBackground) theme.darkerBackground = theme.contrast
  return extend(
    {
      consoleWarnBackground: '#332a00',
      consoleWarnForeground: '#ffcb6b',
      consoleWarnBorder: '#650',
      consoleErrorBackground: '#290000',
      consoleErrorForeground: '#ff8080',
      consoleErrorBorder: '#5c0000',
      light: '#ccc',
      dark: '#aaa'
    },
    theme
  )
}

function createLightTheme(theme) {
  if (!theme.darkerBackground) theme.darkerBackground = theme.contrast
  return extend(
    {
      consoleWarnBackground: '#fffbe5',
      consoleWarnForeground: '#5c5c00',
      consoleWarnBorder: '#fff5c2',
      consoleErrorBackground: '#fff0f0',
      consoleErrorForeground: '#f00',
      consoleErrorBorder: '#ffd6d6',
      light: '#fff',
      dark: '#eee'
    },
    theme
  )
}

const themes = {
  Light: createLightTheme({
    darkerBackground: '#f3f3f3',
    background: '#fff',
    foreground: '#333',
    selectForeground: '#333',
    accent: '#1a73e8',
    highlight: '#eaeaea',
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
    commentColor: '#747474'
  }),
  'Material Oceanic': createDarkTheme({
    background: '#263238',
    foreground: '#B0BEC5',
    selectForeground: '#FFFFFF',
    accent: '#009688',
    highlight: '#425B67',
    border: '#2A373E',
    primary: '#607D8B',
    contrast: '#1E272C',
    varColor: '#eeffff',
    stringColor: '#c3e88d',
    keywordColor: '#c792ea',
    numberColor: '#f78c6c',
    operatorColor: '#89ddff',
    linkColor: '#80cbc4',
    textColor: '#B0BEC5',
    tagNameColor: '#f07178',
    functionColor: '#82aaff',
    attributeNameColor: '#ffcb6b',
    commentColor: '#546e7a'
  }),
  'Material Darker': createDarkTheme({
    background: '#212121',
    foreground: '#B0BEC5',
    selectForeground: '#FFFFFF',
    accent: '#FF9800',
    highlight: '#3F3F3F',
    border: '#292929',
    primary: '#727272',
    contrast: '#1A1A1A',
    varColor: '#eeffff',
    stringColor: '#c3e88d',
    keywordColor: '#c792ea',
    numberColor: '#f78c6c',
    operatorColor: '#89ddff',
    linkColor: '#80cbc4',
    textColor: '#B0BEC5',
    tagNameColor: '#f07178',
    functionColor: '#82aaff',
    attributeNameColor: '#ffcb6b',
    commentColor: '#616161'
  }),
  'Material Lighter': createLightTheme({
    background: '#FAFAFA',
    foreground: '#546E7A',
    selectForeground: '#546e7a',
    accent: '#00BCD4',
    highlight: '#E7E7E8',
    border: '#d3e1e8',
    primary: '#94A7B0',
    contrast: '#F4F4F4',
    varColor: '#272727',
    stringColor: '#91B859',
    keywordColor: '#7C4DFF',
    numberColor: '#F76D47',
    operatorColor: '#39ADB5',
    linkColor: '#39ADB5',
    textColor: '#546E7A',
    tagNameColor: '#E53935',
    functionColor: '#6182B8',
    attributeNameColor: '#F6A434',
    commentColor: '#AABFC9'
  }),
  'Material Palenight': createDarkTheme({
    background: '#292D3E',
    foreground: '#A6ACCD',
    selectForeground: '#FFFFFF',
    accent: '#ab47bc',
    highlight: '#444267',
    border: '#2b2a3e',
    primary: '#676E95',
    contrast: '#202331',
    varColor: '#eeffff',
    stringColor: '#c3e88d',
    keywordColor: '#c792ea',
    numberColor: '#f78c6c',
    operatorColor: '#89ddff',
    linkColor: '#80cbc4',
    textColor: '#A6ACCD',
    tagNameColor: '#f07178',
    functionColor: '#82aaff',
    attributeNameColor: '#ffcb6b',
    commentColor: '#676E95'
  }),
  'Material Deep Ocean': createDarkTheme({
    background: '#0F111A',
    foreground: '#8F93A2',
    selectForeground: '#FFFFFF',
    accent: '#84ffff',
    highlight: '#1F2233',
    border: '#0F111A',
    primary: '#4B526D',
    contrast: '#090B10',
    varColor: '#eeffff',
    stringColor: '#c3e88d',
    keywordColor: '#c792ea',
    numberColor: '#f78c6c',
    operatorColor: '#89ddff',
    linkColor: '#80cbc4',
    textColor: '#8F93A2',
    tagNameColor: '#f07178',
    functionColor: '#82aaff',
    attributeNameColor: '#ffcb6b',
    commentColor: '#717CB4'
  }),
  'Monokai Pro': createDarkTheme({
    background: '#2D2A2E',
    foreground: '#fcfcfa',
    selectForeground: '#FFFFFF',
    accent: '#ffd866',
    highlight: '#5b595c',
    border: '#2d2a2e',
    primary: '#939293',
    contrast: '#221F22',
    varColor: '#FCFCFA',
    stringColor: '#FFD866',
    keywordColor: '#FF6188',
    numberColor: '#AB9DF2',
    operatorColor: '#FF6188',
    linkColor: '#78DCE8',
    textColor: '#fcfcfa',
    tagNameColor: '#FF6188',
    functionColor: '#A9DC76',
    attributeNameColor: '#78DCE8',
    commentColor: '#727072'
  }),
  Dracula: createDarkTheme({
    background: '#282A36',
    foreground: '#F8F8F2',
    selectForeground: '#8BE9FD',
    accent: '#FF79C5',
    highlight: '#6272A4',
    border: '#21222C',
    primary: '#6272A4',
    contrast: '#191A21',
    varColor: '#F8F8F2',
    stringColor: '#F1FA8C',
    keywordColor: '#FF79C6',
    numberColor: '#BD93F9',
    operatorColor: '#FF79C6',
    linkColor: '#F1FA8C',
    textColor: '#F8F8F2',
    tagNameColor: '#FF79C6',
    functionColor: '#50FA78',
    attributeNameColor: '#50FA7B',
    commentColor: '#6272A4'
  }),
  'Arc Dark': createDarkTheme({
    background: '#2f343f',
    foreground: '#D3DAE3',
    selectForeground: '#FFFFFF',
    accent: '#42A5F5',
    highlight: '#3F3F46',
    border: '#404552',
    primary: '#8b9eb5',
    contrast: '#262b33',
    varColor: '#CF6A4C',
    stringColor: '#8F9D6A',
    keywordColor: '#9B859D',
    numberColor: '#CDA869',
    operatorColor: '#A7A7A7',
    linkColor: '#7587A6',
    textColor: '#D3DAE3',
    tagNameColor: '#CF6A4C',
    functionColor: '#7587A6',
    attributeNameColor: '#F9EE98',
    commentColor: '#747C84'
  }),
  'Atom One Dark': createDarkTheme({
    background: '#282C34',
    foreground: '#979FAD',
    selectForeground: '#FFFFFF',
    accent: '#2979ff',
    highlight: '#383D48',
    border: '#282C34',
    primary: '#979FAD',
    contrast: '#21252B',
    varColor: '#D19A66',
    stringColor: '#98C379',
    keywordColor: '#C679DD',
    numberColor: '#D19A66',
    operatorColor: '#61AFEF',
    linkColor: '#56B6C2',
    textColor: '#979FAD',
    tagNameColor: '#F07178',
    functionColor: '#61AEEF',
    attributeNameColor: '#E5C17C',
    commentColor: '#59626F'
  }),
  'Atom One Light': createLightTheme({
    background: '#FAFAFA',
    foreground: '#232324',
    selectForeground: '#232324',
    accent: '#2979ff',
    highlight: '#EAEAEB',
    border: '#DBDBDC',
    primary: '#9D9D9F',
    contrast: '#FFFFFF',
    varColor: '#986801',
    stringColor: '#50A14E',
    keywordColor: '#A626A4',
    numberColor: '#986801',
    operatorColor: '#4078F2',
    linkColor: '#0184BC',
    textColor: '#232324',
    tagNameColor: '#E4564A',
    functionColor: '#4078F2',
    attributeNameColor: '#C18401',
    commentColor: '#A0A1A7'
  }),
  'Solarized Dark': createDarkTheme({
    background: '#002B36',
    foreground: '#839496',
    selectForeground: '#FFFFFF',
    accent: '#d33682',
    highlight: '#11353F',
    border: '#0D3640',
    primary: '#586e75',
    contrast: '#00252E',
    varColor: '#268BD2',
    stringColor: '#2AA198',
    keywordColor: '#859900',
    numberColor: '#D33682',
    operatorColor: '#93A1A1',
    linkColor: '#268BD2',
    textColor: '#839496',
    tagNameColor: '#268BD2',
    functionColor: '#B58900',
    attributeNameColor: '#B58900',
    commentColor: '#657B83'
  }),
  'Solarized Light': createLightTheme({
    background: '#fdf6e3',
    foreground: '#586e75',
    selectForeground: '#002b36',
    accent: '#d33682',
    highlight: '#F6F0DE',
    border: '#edead9',
    primary: '#93a1a1',
    contrast: '#eee8d5',
    varColor: '#268BD2',
    stringColor: '#2AA198',
    keywordColor: '#859900',
    numberColor: '#D33682',
    operatorColor: '#657B83',
    linkColor: '#268BD2',
    textColor: '#586e75',
    tagNameColor: '#268BD2',
    functionColor: '#B58900',
    attributeNameColor: '#657B83',
    commentColor: '#93A1A1'
  }),
  Github: createLightTheme({
    background: '#F7F8FA',
    foreground: '#5B6168',
    selectForeground: '#FFFFFF',
    accent: '#79CB60',
    highlight: '#CCE5FF',
    border: '#DFE1E4',
    primary: '#292D31',
    contrast: '#FFFFFF',
    varColor: '#24292E',
    stringColor: '#032F62',
    keywordColor: '#D73A49',
    numberColor: '#005CC5',
    operatorColor: '#D73A49',
    linkColor: '#005CC5',
    textColor: '#5B6168',
    tagNameColor: '#22863A',
    functionColor: '#6F42C1',
    attributeNameColor: '#6F42C1',
    commentColor: '#6A737D'
  }),
  'Night Owl': createDarkTheme({
    background: '#011627',
    foreground: '#b0bec5',
    selectForeground: '#ffffff',
    accent: '#7e57c2',
    highlight: '#152C3B',
    border: '#2a373e',
    primary: '#607d8b',
    contrast: '#001424',
    varColor: '#addb67',
    stringColor: '#ecc48d',
    keywordColor: '#c792ea',
    numberColor: '#f78c6c',
    operatorColor: '#c792ea',
    linkColor: '#80CBC4',
    textColor: '#b0bec5',
    tagNameColor: '#7fdbca',
    functionColor: '#82AAFF',
    attributeNameColor: '#FAD430',
    commentColor: '#637777'
  }),
  'Light Owl': createLightTheme({
    background: '#FAFAFA',
    foreground: '#546e7a',
    selectForeground: '#403f53',
    accent: '#269386',
    highlight: '#E0E7EA',
    border: '#efefef',
    primary: '#403F53',
    contrast: '#FAFAFA',
    varColor: '#0C969B',
    stringColor: '#c96765',
    keywordColor: '#994cc3',
    numberColor: '#aa0982',
    operatorColor: '#7d818b',
    linkColor: '#994cc3',
    textColor: '#546e7a',
    tagNameColor: '#994cc3',
    functionColor: '#4876d6',
    attributeNameColor: '#4876d6',
    commentColor: '#637777'
  })
}

let curTheme = themes.Light

const exports = function(css, container) {
  css = toStr(css)

  for (let i = 0, len = styleList.length; i < len; i++) {
    if (styleList[i].css === css) return
  }

  container = container || exports.container || document.head
  const el = document.createElement('style')

  el.type = 'text/css'
  container.appendChild(el)

  const style = { css, el, container }
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

export default exports
