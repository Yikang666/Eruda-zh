import util from '../lib/util'

var borderCss = '',
    selector = 'html',
    colors = ['f5f5f5', 'dabb3a', 'abc1c7', '472936', 'c84941', '296dd1', '67adb4', '1ea061'];

util.each(colors, function (color, idx)
{
    selector += (idx === 0) ? '>*:not([class^="eruda-"])' : '>*';

    borderCss += selector + `{border: 2px solid #${color} !important}`;
});

export default [
    {
        name: 'Border All',
        fn: function ()
        {
            util.evalCss(borderCss);
        },
        desc: 'Add color borders to all elements'
    },
    {
        name: 'Refresh Page',
        fn: function ()
        {
            var url = window.location.href;

            window.location.replace(query(url, 'timestamp', util.now()));
        },
        desc: 'Add timestamp to url and refresh'
    }
];

function query(uri, key, val)
{
    var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i'),
        separator = uri.indexOf('?') !== -1 ? '&' : '?';

    if (uri.match(re)) return uri.replace(re, '$1' + key + '=' + val + '$2');

    return uri + separator + key + '=' + val;
}