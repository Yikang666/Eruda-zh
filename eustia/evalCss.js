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