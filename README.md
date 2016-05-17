# Eruda

Console for Mobile Browsers.

![Eruda](http://7xn2zy.com1.z0.glb.clouddn.com/eruda_screenshot.jpg)

## Why

Logging things out on mobile browser is never an easy stuff. I used to include `window onerror alert` script inside pages to find out JavaScript errors, kind of stupid and inefficient. Desktop browser DevTools is great, and I wish there is a similar one on mobile side, which leads to the creation of Eruda.

## Demo

![Demo](http://7xn2zy.com1.z0.glb.clouddn.com/eruda_qrcode.png)

Browse it on your phone: [http://liriliri.github.io/eruda/](http://liriliri.github.io/eruda/)

In order to try it on different sites, execute the script below on address bar.

```javascript
javascript:(function () { var script = document.createElement('script'); script.src="//liriliri.github.io/eruda/eruda.min.js"; document.body.appendChild(script); script.onload=function () { eruda.init() } })();
```

## Features

* Console: Display JavaScript logs.
* Elements: Check dom state.
* Network: Show performance timing, ajax requests status.
* Resource: Show localStorage, cookie information.
* Info: Show url, user agent info.
* Snippets: Include snippets you used most often.
* Sources: Html, js, css source viewer.
* Features: Browser feature detections.

## Install

You can get it on npm.

```bash
npm install eruda --save
```

Add this script to your page.

```javascript
(function () {
    var src = 'node_modules/eruda/dist/eruda.min.js';
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
})();
```

> The JavaScript file size is quite huge and therefore not suitable to include
in mobile pages. We add this script to make sure eruda is loaded only when eruda
is set to true on url(http://example.com/?eruda=true).

## Plugins

It is possible to enhance Eruda with more features by writing plugins. Please check [eruda-fps](https://github.com/liriliri/eruda-fps), a plugin for displaying page
fps info, as a start example to write your own custom tool panels.

## License

Eruda is released under the MIT license. Please see
[LICENSE](https://opensource.org/licenses/MIT) for full details.
