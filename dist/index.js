var js = document.scripts
js = js[js.length - 1].src.substring(
  0,
  js[js.length - 1].src.lastIndexOf('/') + 1
)
document.write('<script src="' + js + 'eruda.js"></script>')
document.write('<script>eruda.init();</script>')
document.write('<script src="' + js + 'zh.js"></script>')
