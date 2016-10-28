function exports(obj)
{
    if (obj.constructor && obj.constructor.name) return obj.constructor.name;

    return util.upperFirst(({}).toString.call(obj).replace(/(\[object )|]/g, ''));
}