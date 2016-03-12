loadJs = function (url)
{
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
};