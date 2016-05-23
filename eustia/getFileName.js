_('last trim');

function exports(url)
{
    var ret = last(url.split('/'));

    if (ret.indexOf('?') > -1) ret = trim(ret.split('?')[0]);

    return ret === '' ? 'unknown' : ret;
}