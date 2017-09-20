// Built by eustia.
window._ = (function()
{
    var _ = {};

    if (typeof window === 'object' && window._) _ = window._;

    /* ------------------------------ evalCss ------------------------------ */

    _.evalCss = (function ()
    {
        var mark = [];

        function exports(css)
        {
            for (var i = 0, len = mark.length; i < len; i++)
            {
                if (mark[i] === css) return;
            }
            mark.push(css);

            var container = exports.container || document.head,
                style = document.createElement('style');

            style.type = 'text/css';
            style.textContent = css;

            container.appendChild(style);
        }

        return exports;
    })();

    return _;
})();