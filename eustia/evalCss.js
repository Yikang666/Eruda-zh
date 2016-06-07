function exports(css)
{
    var container = exports.container || document.head,
        style = document.createElement('style');

    style.type = 'text/css';
    style.textContent = css;

    container.appendChild(style);
}