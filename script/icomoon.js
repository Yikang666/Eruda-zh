/* Icons(Font-awesome): times-circle, exclamation-triangle, chevron-left,
 * chevron-right, repeat, trash, cog, ban, info-circle, hand-pointer-o, eye,
 * rotate-left
 */

var fs = require('fs'),
    path = require('path');

fs.readFile(path.resolve(__dirname, 'icomoon/fonts/icomoon.woff'), function (err, data)
{
    if (err) return console.log(err);

    genCssFile(data.toString('base64'));
});

function genCssFile(fontData)
{
    fs.readFile(path.resolve(__dirname, 'icomoon/style.css'), 'utf-8', function (err, data)
    {
        if (err) return console.log(err);

        data = data.split('\n');
        data.splice(2, 5, '    src: url(\'data:application/x-font-woff;charset=utf-8;base64,' +
                          fontData + '\') format(\'woff\');');
        data = data.join('\n');
        data = data.replace(/icon-"/g, 'eruda-icon-"');

        writeCssFile(data);
    });
}

function writeCssFile(data)
{
    fs.writeFile(path.resolve(__dirname, '../src/style/icon.css'), data, 'utf-8', function (err, data)
    {
        if (err) return console.log(err);

        console.log('icon.css generated!');
    })
}