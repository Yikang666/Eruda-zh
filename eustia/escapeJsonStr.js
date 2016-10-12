function exports(str)
{
    return str.replace(/\\/g, '\\\\')
              .replace(/"/g, '\\"')
              .replace(/\f|\n|\r|\t/g, '');
}
