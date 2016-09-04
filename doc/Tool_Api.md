# Tool Api

Each default tool provided by eruda can be accessed by `eruda.get('Tool Name')`.

## Console

Displays console logs. Implementation detail follows the [console api spec](https://github.com/DeveloperToolsWG/console-object/blob/master/api.md).

### Config

|Name               |Type   |Desc                           |
|-------------------|-------|-------------------------------|
|catchGlobalErr     |boolean|Catch global errors            |
|overrideConsole    |boolean|Override console               |
|displayExtraInfo   |boolean|Display extra information      |
|displayUnenumerable|boolean|Display unenumerable properties|
|displayGetterVal   |boolean|Access getter value            |
|viewLogInSources   |boolean|View log in sources panel      |
|displayIfErr       |boolean|Auto display if error occurs   |
|maxLogNum          |string |Max log number                 |

```javascript
var console = eruda.get('console');
console.config.set('catchGlobalErr', true);
```

### log, error, info, warn, dir, time/timeEnd, clear, count, assert, table

All these methods can be used in the same way as window.console object.

```javascript
var console = eruda.get('console');
console.log('eruda is a console for %s.', 'mobile browsers');
console.table([{test: 1}, {test: 2}, {test2: 3}], 'test');
console.error(new Error('eruda'));
```

### filter

Filters logs.

|Name  |Type                  |Desc         |
|------|----------------------|-------------|
|filter|string regexp function|Custom filter|

```javascript
console.filter('all'); // String parameter. Log, warn, debug, error is also supported.
console.filter(/^eruda/);
console.filter(function (log)
{
    return log.type === 'error';
});
```

### html

Logs out html content.

|Name|Type  |Desc       |
|----|------|-----------|
|html|string|Html string|

```javascript
console.html('<span style="color:red">Red</span>');
```

## Elements

## Network

## Resources

## Sources

## Info

## Snippets

## Features

## Settings
