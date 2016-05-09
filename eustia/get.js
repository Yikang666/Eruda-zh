function exports(url, cb)
{
    var xhr = new window.XMLHttpRequest();

    xhr.onload = function ()
    {
        var status = xhr.status;

        if ((status >= 200 && status < 300) || status === 304)
        {
            cb(null, xhr.responseText);
        }
    };

    xhr.onerror = function () { cb(xhr) };

    xhr.open('GET', url);
    xhr.send();
}