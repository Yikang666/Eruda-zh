# Tool Api

Each default tool provided by eruda can be accessed by `eruda.get('Tool Name')`.

## Console

Displays console logs. Implementation detail follows the [console api spec](https://github.com/DeveloperToolsWG/console-object/blob/master/api.md).

### log, error, info, warn, dir, time/timeEnd, clear, count, assert, table

All these methods can be used in the same way as window.console object.

```javascript
var console = eruda.get('console');
console.log('eruda is a console for %s.', 'mobile browsers');
console.table([{test: 1}, {test: 2, test2: 3}], 'test');
```

## Elements

## Network

## Resources

## Sources

## Info

## Snippets

## Features

## Settings
