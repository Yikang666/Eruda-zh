_('toNum');

function exports(str)
{
    return toNum(str.replace('px', ''));
}