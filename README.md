# Eruda

Console for Mobile Browsers.

![Eruda](http://7xn2zy.com1.z0.glb.clouddn.com/github_eruda.jpg)

## Why

Logging things out on mobile browser is never an easy stuff. I used to include `window onerror alert` script inside pages to find out JavaScript errors, kind of stupid and inefficient. Desktop browser DevTools is great, and I wish there is a similar one on mobile side, which leads to the creation of Eruda.

## Demo

Browse it on your phone: [http://liriliri.github.io/eruda/index.html?eruda=true](http://liriliri.github.io/eruda/index.html?eruda=true)

## Features

* Console: Display JavaScript logs.
* Network: Show performance timing.
* Elements: Check dom state.
* Snippets: Include snippets you used most often.
* Resource: Show localStorage, cookie information.

## Install

You can get it on npm.

```
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

> The JavaScript file size is quite huge and therefore not suitable to include in mobile pages. We add this script to make sure eruda is loaded only when eruda is set to true on url(http://example.com/?eruda=true).

## License

Eruda is released under the MIT license. Please see [LICENSE](https://opensource.org/licenses/MIT) for full details.





