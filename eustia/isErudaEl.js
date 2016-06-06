function exports(el)
{
    var parentNode = el.parentNode;

    if (!parentNode) return false;

    while (parentNode)
    {
        parentNode = parentNode.parentNode;
        if (parentNode && parentNode.id === 'eruda') return true;
    }

    return false;
}