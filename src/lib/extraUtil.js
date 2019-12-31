import beautify from 'js-beautify'
import evalCss from './evalCss'

export default function(util) {
  Object.assign(util, {
    beautify,
    evalCss
  })
}
