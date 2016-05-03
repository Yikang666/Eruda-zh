import util from '../lib/util'

var borderCss = '',
    selector = 'html',
    colors = ['f5f5f5', 'dabb3a', 'abc1c7', '472936', 'c84941', '296dd1', '67adb4', '1ea061'];

util.each(colors, function (color)
{
    selector += '>*';

    borderCss += selector + '{border: 2px solid #' + color + ' !important}';
});

export default [
    {
        name: 'Border All',
        fn: function ()
        {
            util.evalCss(borderCss);
        },
        desc: 'Add color borders to all elements'
    }
];