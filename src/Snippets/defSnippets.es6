import util from '../util'

var borderCss = 'html>* {border: 2px solid #f5f5f5 !important}' +
                'html>*>* {border: 2px solid #dabb3a !important}' +
                'html>*>*>* {border: 2px solid #abc1c7 !important}' +
                'html>*>*>*>* {border: 2px solid #472936 !important}' +
                'html>*>*>*>*>* {border: 2px solid #c84941 !important}' +
                'html>*>*>*>*>*>* {border: 2px solid #296dd1 !important}' +
                'html>*>*>*>*>*>*>* {border: 2px solid #67adb4 !important}' +
                'html>*>*>*>*>*>*>*>* {border: 2px solid #1ea061 !important}';

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