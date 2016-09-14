# Tool Api

Each default tool provided by eruda can be accessed by `eruda.get('Tool Name')`.

## Console

Display console logs. Implementation detail follows the [console api spec](https://github.com/DeveloperToolsWG/console-object/blob/master/api.md).

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

Filter logs.

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

Log out html content.

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

Display special information, could be used for displaying user info to track 
user logs.
 
By default, page url and browser user agent is shown.

### clear

Clear infos.

### add

Add info.

|Name   |Type  |Desc        |
|-------|------|------------|
|name   |string|Info name   |
|content|string|Info content|

```javascript
info.add('title', 'content');
```

### remove

Remove specified info.

|Name|Type  |Desc     |
|----|------|---------|
|name|string|Info name|

```javascript
info.remove('title');
```

## Snippets

Allow you to register small functions that can be triggered multiple times.

### clear

Clear Snippets.

### add

Add Snippet.

|Name|Type    |Desc                    |
|----|--------|------------------------|
|name|string  |Snippet name            |
|fn  |function|Function to be triggered|
|desc|string  |Snippet description     |

```javascript
snippets.add('hello', function () 
{
    console.log('Hello World!');
}, 'Display hello on console');
```

### remove

Remove specified snippet.

|Name|Type  |Desc             |
|----|------|-----------------|
|name|string|Snippet to remove|

```javascript
snippets.remove('hello');
```

## Features

Browser feature detections, thanks to 
[modernizr](https://github.com/Modernizr/Modernizr) project.

Red means unsupported, otherwise ok. All buttons is linked directly to 
related materials in [Can I Use](http://caniuse.com/) website.

## Settings
