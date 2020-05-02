# Eruda Util Documentation

## $ 

jQuery like style dom manipulator.

### Available methods

offset, hide, show, first, last, get, eq, on, off, html, text, val, css, attr,
data, rmAttr, remove, addClass, rmClass, toggleClass, hasClass, append, prepend,
before, after

```javascript
const $btn = $('#btn');
$btn.html('eustia');
$btn.addClass('btn');
$btn.show();
$btn.on('click', function() {
    // Do something...
});
```

## $attr 

Element attribute manipulation.

Get the value of an attribute for the first element in the set of matched elements.

|Name   |Desc                            |
|-------|--------------------------------|
|element|Elements to manipulate          |
|name   |Attribute name                  |
|return |Attribute value of first element|

Set one or more attributes for the set of matched elements.

|Name   |Desc                  |
|-------|----------------------|
|element|Elements to manipulate|
|name   |Attribute name        |
|val    |Attribute value       |

|Name      |Desc                                  |
|----------|--------------------------------------|
|element   |Elements to manipulate                |
|attributes|Object of attribute-value pairs to set|

### remove

Remove an attribute from each element in the set of matched elements.

|Name   |Desc                  |
|-------|----------------------|
|element|Elements to manipulate|
|name   |Attribute name        |

```javascript
$attr('#test', 'attr1', 'test');
$attr('#test', 'attr1'); // -> test
$attr.remove('#test', 'attr1');
$attr('#test', {
    attr1: 'test',
    attr2: 'test'
});
```

## $class 

Element class manipulations.

### add

Add the specified class(es) to each element in the set of matched elements.

|Name   |Desc                  |
|-------|----------------------|
|element|Elements to manipulate|
|names  |Classes to add        |

### has

Determine whether any of the matched elements are assigned the given class.

|Name   |Desc                                 |
|-------|-------------------------------------|
|element|Elements to manipulate               |
|name   |Class name                           |
|return |True if elements has given class name|

### toggle

Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.

|Name   |Desc                  |
|-------|----------------------|
|element|Elements to manipulate|
|name   |Class name to toggle  |

### remove

Remove a single class, multiple classes, or all classes from each element in the set of matched elements.

|Name   |Desc                  |
|-------|----------------------|
|element|Elements to manipulate|
|name   |Class names to remove |

```javascript
$class.add('#test', 'class1');
$class.add('#test', ['class1', 'class2']);
$class.has('#test', 'class1'); // -> true
$class.remove('#test', 'class1');
$class.has('#test', 'class1'); // -> false
$class.toggle('#test', 'class1');
$class.has('#test', 'class1'); // -> true
```

## $css 

Element css manipulation.

Get the computed style properties for the first element in the set of matched elements.

|Name   |Desc                      |
|-------|--------------------------|
|element|Elements to manipulate    |
|name   |Property name             |
|return |Css value of first element|

Set one or more CSS properties for the set of matched elements.

|Name   |Desc                  |
|-------|----------------------|
|element|Elements to manipulate|
|name   |Property name         |
|val    |Css value             |

|Name      |Desc                            |
|----------|--------------------------------|
|element   |Elements to manipulate          |
|properties|Object of css-value pairs to set|

```javascript
$css('#test', {
    color: '#fff',
    background: 'black',
    opacity: 0.5
});
$css('#test', 'display', 'block');
$css('#test', 'color'); // -> #fff
```

## $data 

Wrapper of $attr, adds data- prefix to keys.

```javascript
$data('#test', 'attr1', 'eustia');
```

## $event 

bind events to certain dom elements.

```javascript
function clickHandler() {
    // Do something...
}
$event.on('#test', 'click', clickHandler);
$event.off('#test', 'click', clickHandler);
```

## $insert 

Insert html on different position.

### before

Insert content before elements.

### after

Insert content after elements.

### prepend

Insert content to the beginning of elements.

### append

Insert content to the end of elements.

|Name   |Desc                  |
|-------|----------------------|
|element|Elements to manipulate|
|content|Html strings          |

```javascript
// <div id="test"><div class="mark"></div></div>
$insert.before('#test', '<div>licia</div>');
// -> <div>licia</div><div id="test"><div class="mark"></div></div>
$insert.after('#test', '<div>licia</div>');
// -> <div id="test"><div class="mark"></div></div><div>licia</div>
$insert.prepend('#test', '<div>licia</div>');
// -> <div id="test"><div>licia</div><div class="mark"></div></div>
$insert.append('#test', '<div>licia</div>');
// -> <div id="test"><div class="mark"></div><div>licia</div></div>
```

## $offset 

Get the position of the element in document.

|Name   |Desc                  |
|-------|----------------------|
|element|Elements to get offset|
|return |Element position      |

```javascript
$offset('#test'); // -> {left: 0, top: 0, width: 0, height: 0}
```

## $property 

Element property html, text, val getter and setter.

### html

Get the HTML contents of the first element in the set of matched elements or
set the HTML contents of every matched element.

### text

Get the combined text contents of each element in the set of matched
elements, including their descendants, or set the text contents of the
matched elements.

### val

Get the current value of the first element in the set of matched elements or
set the value of every matched element.

```javascript
$property.html('#test', 'licia');
$property.html('#test'); // -> licia
```

## $remove 

Remove the set of matched elements from the DOM.

|Name   |Desc              |
|-------|------------------|
|element|Elements to delete|

```javascript
$remove('#test');
```

## $safeEls 

Convert value into an array, if it's a string, do querySelector.

|Name  |Desc             |
|------|-----------------|
|val   |Value to convert |
|return|Array of elements|

```javascript
$safeEls(document.querySelector('.test'));
$safeEls(document.querySelectorAll('.test'));
$safeEls('.test'); // -> Array of elements with test class
```

## $show 

Show elements.

|Name   |Desc            |
|-------|----------------|
|element|Elements to show|

```javascript
$show('#test');
```

## Class 

Create JavaScript class.

|Name   |Desc                             |
|-------|---------------------------------|
|methods|Public methods                   |
[statics|Static methods                   |
|return |Function used to create instances|

```javascript
const People = Class({
    initialize: function People(name, age) {
        this.name = name;
        this.age = age;
    },
    introduce: function() {
        return 'I am ' + this.name + ', ' + this.age + ' years old.';
    }
});

const Student = People.extend(
    {
        initialize: function Student(name, age, school) {
            this.callSuper(People, 'initialize', arguments);

            this.school = school;
        },
        introduce: function() {
            return (
                this.callSuper(People, 'introduce') +
                '\n I study at ' +
                this.school +
                '.'
            );
        }
    },
    {
        is: function(obj) {
            return obj instanceof Student;
        }
    }
);

const a = new Student('allen', 17, 'Hogwarts');
a.introduce(); // -> 'I am allen, 17 years old. \n I study at Hogwarts.'
Student.is(a); // -> true
```

## Emitter 

Event emitter class which provides observer pattern.

### on

Bind event.

### off

Unbind event.

### once

Bind event that trigger once.

|Name    |Desc          |
|--------|--------------|
|event   |Event name    |
|listener|Event listener|

### emit

Emit event.

|Name   |Desc                        |
|-------|----------------------------|
|event  |Event name                  |
|...args|Arguments passed to listener|

### mixin

[static] Mixin object class methods.

|Name|Desc           |
|----|---------------|
|obj |Object to mixin|

```javascript
const event = new Emitter();
event.on('test', function(name) {
    console.log(name);
});
event.emit('test', 'licia'); // Logs out 'licia'.
Emitter.mixin({});
```

## Enum 

Enum type implementation.

### constructor

|Name|Desc            |
|----|----------------|
|arr |Array of strings|

|Name|Desc                  |
|----|----------------------|
|obj |Pairs of key and value|

```javascript
const importance = new Enum([
    'NONE',
    'TRIVIAL',
    'REGULAR',
    'IMPORTANT',
    'CRITICAL'
]);
const val = 1;
if (val === importance.CRITICAL) {
    // Do something.
}
```

## LocalStore 

LocalStorage wrapper.

Extend from Store.

### constructor

|Name|Desc                  |
|----|----------------------|
|name|LocalStorage item name|
|data|Default data          |

```javascript
const store = new LocalStore('licia');
store.set('name', 'licia');
```

## Logger 

Simple logger with level filter.

### constructor

|Name       |Desc        |
|-----------|------------|
|name       |Logger name |
|level=DEBUG|Logger level|

### setLevel

Set level.

|Name |Desc        |
|-----|------------|
|level|Logger level|

### getLevel

Get current level.

### trace, debug, info, warn, error

Logging methods.

### Log Levels

TRACE, DEBUG, INFO, WARN, ERROR and SILENT.

```javascript
const logger = new Logger('licia', Logger.level.ERROR);
logger.trace('test');

// Format output.
logger.formatter = function(type, argList) {
    argList.push(new Date().getTime());

    return argList;
};

logger.on('all', function(type, argList) {
    // It's not affected by log level.
});

logger.on('debug', function(argList) {
    // Affected by log level.
});
```

## MediaQuery 

CSS media query listener.

Extend from Emitter.

### constructor

|Name |Desc       |
|-----|-----------|
|query|Media query|

### isMatch

Return true if given media query matches.

### Events

#### match

Triggered when a media query matches.

#### unmatch

Opposite of match.

```javascript
const mediaQuery = new MediaQuery('screen and (max-width:1000px)');
mediaQuery.isMatch(); // -> false
mediaQuery.on('match', () => {
    // Do something...
});
```

## MutationObserver 

Safe MutationObserver, does nothing if MutationObserver is not supported.

```javascript
const observer = new MutationObserver(function(mutations) {
    // Do something.
});
observer.observe(document.documentElement);
observer.disconnect();
```

## Select 

Simple wrapper of querySelectorAll to make dom selection easier.

### constructor

|Name    |Desc               |
|--------|-------------------|
|selector|Dom selector string|

### find

Get desdendants of current matched elements.

|Name    |Desc               |
|--------|-------------------|
|selector|Dom selector string|

### each

Iterate over matched elements.

|Name|Desc                                |
|----|------------------------------------|
|fn  |Function to execute for each element|

```javascript
const $test = new Select('#test');
$test.find('.test').each(function(idx, element) {
    // Manipulate dom nodes
});
```

## Stack 

Stack data structure.

### size

Stack size.

### clear

Clear the stack.

### push

Add an item to the stack.

|Name  |Desc        |
|------|------------|
|item  |Item to add |
|return|Current size|

### pop

Get the last item of the stack.

### peek

Get the last item without removing it.

### forEach

Iterate over the stack.

|Name    |Desc                      |
|--------|--------------------------|
|iterator|Function invoked iteration|
|ctx     |Function context          |

### toArr

Convert the stack to a JavaScript array.

```javascript
const stack = new Stack();

stack.push(2); // -> 1
stack.push(3); // -> 2
stack.pop(); // -> 3
```

## Store 

Memory storage.

Extend from Emitter.

### constructor

|Name|Desc        |
|----|------------|
|data|Initial data|

### set

Set value.

|Name|Desc        |
|----|------------|
|key |Value key   |
|val |Value to set|

Set values.

|Name  |Desc           |
|------|---------------|
|values|Key value pairs|

This emit a change event whenever is called.

### get

Get value.

|Name  |Desc              |
|------|------------------|
|key   |Value key         |
|return|Value of given key|

Get values.

|Name  |Desc           |
|------|---------------|
|keys  |Array of keys  |
|return|Key value pairs|

### remove

Remove value.

|Name|Desc         |
|----|-------------|
|key |Key to remove|

### clear

Clear all data.

### each

Iterate over values.

|Name|Desc                          |
|----|------------------------------|
|fn  |Function invoked per iteration|

```javascript
const store = new Store('test');
store.set('user', { name: 'licia' });
store.get('user').name; // -> 'licia'
store.clear();
store.each(function(val, key) {
    // Do something.
});
store.on('change', function(key, newVal, oldVal) {
    // It triggers whenever set is called.
});
```

## Url 

Simple url manipulator.

### constructor

|Name        |Desc      |
|------------|----------|
|url=location|Url string|

### setQuery

Set query value.

|Name  |Desc       |
|------|-----------|
|name  |Query name |
|val   |Query value|
|return|this       |

|Name  |Desc        |
|------|------------|
|query |query object|
|return|this        |

### rmQuery

Remove query value.

|Name  |Desc      |
|------|----------|
|name  |Query name|
|return|this      |

### parse

[static] Parse url into an object.

|Name  |Desc      |
|------|----------|
|url   |Url string|
|return|Url object|

### stringify

[static] Stringify url object into a string.

|Name  |Desc      |
|------|----------|
|url   |Url object|
|return|Url string|

An url object contains the following properties:

|Name    |Desc                                                                                  |
|--------|--------------------------------------------------------------------------------------|
|protocol|The protocol scheme of the URL (e.g. http:)                                           |
|slashes |A boolean which indicates whether the protocol is followed by two forward slashes (//)|
|auth    |Authentication information portion (e.g. username:password)                           |
|hostname|Host name without port number                                                         |
|port    |Optional port number                                                                  |
|pathname|URL path                                                                              |
|query   |Parsed object containing query string                                                 |
|hash    |The "fragment" portion of the URL including the pound-sign (#)                        |

```javascript
const url = new Url('http://example.com:8080?eruda=true');
console.log(url.port); // -> '8080'
url.query.foo = 'bar';
url.rmQuery('eruda');
url.toString(); // -> 'http://example.com:8080/?foo=bar'
```

## ajax 

Perform an asynchronous HTTP request.

|Name   |Desc        |
|-------|------------|
|options|Ajax options|

Available options:

|Name                                         |Desc                       |
|---------------------------------------------|---------------------------|
|type=get                                     |Request type               |
|url                                          |Request url                |
|data                                         |Request data               |
|dataType=json                                |Response type(json, xml)   |
|contentType=application/x-www-form-urlencoded|Request header Content-Type|
|success                                      |Success callback           |
|error                                        |Error callback             |
|complete                                     |Callback after request     |
|timeout                                      |Request timeout            |

### get

Shortcut for type = GET;

### post

Shortcut for type = POST;

|Name    |Desc            |
|--------|----------------|
|url     |Request url     |
|data    |Request data    |
|success |Success callback|
|dataType|Response type   |

```javascript
ajax({
    url: 'http://example.com',
    data: { test: 'true' },
    error() {},
    success(data) {
        // ...
    },
    dataType: 'json'
});

ajax.get('http://example.com', {}, function(data) {
    // ...
});
```

## allKeys 

Retrieve all the names of object's own and inherited properties.

|Name   |Desc                       |
|-------|---------------------------|
|obj    |Object to query            |
|options|Options                    |
|return |Array of all property names|

Available options:

|Name              |Desc                     |
|------------------|-------------------------|
|prototype=true    |Include prototype keys   |
|unenumerable=false|Include unenumerable keys|
|symbol=false      |Include symbol keys      |

Members of Object's prototype won't be retrieved.

```javascript
const obj = Object.create({ zero: 0 });
obj.one = 1;
allKeys(obj); // -> ['zero', 'one']
```

## before 

Create a function that invokes less than n times.

|Name  |Desc                                            |
|------|------------------------------------------------|
|n     |Number of calls at which fn is no longer invoked|
|fn    |Function to restrict                            |
|return|New restricted function                         |

Subsequent calls to the created function return the result of the last fn invocation.

```javascript
const fn = before(5, function() {});
fn(); // Allow function to be call 4 times at last.
```

## camelCase 

Convert string to "camelCase".

|Name  |Desc              |
|------|------------------|
|str   |String to convert |
|return|Camel cased string|

```javascript
camelCase('foo-bar'); // -> fooBar
camelCase('foo bar'); // -> fooBar
camelCase('foo_bar'); // -> fooBar
camelCase('foo.bar'); // -> fooBar
```

## castPath 

Cast value into a property path array.

|Name  |Desc               |
|------|-------------------|
|path  |Value to inspect   |
|obj   |Object to query    |
|return|Property path array|

```javascript
castPath('a.b.c'); // -> ['a', 'b', 'c']
castPath(['a']); // -> ['a']
castPath('a[0].b'); // -> ['a', '0', 'b']
castPath('a.b.c', { 'a.b.c': true }); // -> ['a.b.c']
```

## clamp 

Clamp number within the inclusive lower and upper bounds.

|Name  |Desc           |
|------|---------------|
|n     |Number to clamp|
|lower |Lower bound    |
|upper |Upper bound    |
|return|Clamped number |

```javascript
clamp(-10, -5, 5); // -> -5
clamp(10, -5, 5); // -> 5
clamp(2, -5, 5); // -> 2
clamp(10, 5); // -> 5
clamp(2, 5); // -> 2
```

## clone 

Create a shallow-copied clone of the provided plain object.

Any nested objects or arrays will be copied by reference, not duplicated.

|Name  |Desc          |
|------|--------------|
|val   |Value to clone|
|return|Cloned value  |

```javascript
clone({ name: 'eustia' }); // -> {name: 'eustia'}
```

## cloneDeep 

Recursively clone value.

|Name  |Desc             |
|------|-----------------|
|val   |Value to clone   |
|return|Deep cloned Value|

```javascript
const obj = [{ a: 1 }, { a: 2 }];
const obj2 = cloneDeep(obj);
console.log(obj[0] === obj2[1]); // -> false
```

## concat 

Concat multiple arrays into a single array.

|Name  |Desc              |
|------|------------------|
|...arr|Arrays to concat  |
|return|Concatenated array|

```javascript
concat([1, 2], [3], [4, 5]); // -> [1, 2, 3, 4, 5]
```

## contain 

Check if the value is present in the list.

|Name  |Desc                                |
|------|------------------------------------|
|target|Target object                       |
|val   |Value to check                      |
|return|True if value is present in the list|

```javascript
contain([1, 2, 3], 1); // -> true
contain({ a: 1, b: 2 }, 1); // -> true
contain('abc', 'a'); // -> true
```

## cookie 

Simple api for handling browser cookies.

### get

Get cookie value.

|Name  |Desc                      |
|------|--------------------------|
|key   |Cookie key                |
|return|Corresponding cookie value|

### set

Set cookie value.

|Name   |Desc          |
|-------|--------------|
|key    |Cookie key    |
|val    |Cookie value  |
|options|Cookie options|
|return |Module cookie |

### remove

Remove cookie value.

|Name   |Desc          |
|-------|--------------|
|key    |Cookie key    |
|options|Cookie options|
|return |Module cookie |

```javascript
cookie.set('a', '1', { path: '/' });
cookie.get('a'); // -> '1'
cookie.remove('a');
```

## copy 

Copy text to clipboard using document.execCommand.

|Name|Desc             |
|----|-----------------|
|text|Text to copy     |
|cb  |Optional callback|

```javascript
copy('text', function(err) {
    // Handle errors.
});
```

## create 

Create new object using given object as prototype.

|Name  |Desc                   |
|------|-----------------------|
|proto |Prototype of new object|
|return|Created object         |

```javascript
const obj = create({ a: 1 });
console.log(obj.a); // -> 1
```

## createAssigner 

Used to create extend, extendOwn and defaults.

|Name    |Desc                          |
|--------|------------------------------|
|keysFn  |Function to get object keys   |
|defaults|No override when set to true  |
|return  |Result function, extend...    |

## dateFormat 

Simple but extremely useful date format function.

|Name         |Desc                 |
|-------------|---------------------|
|date=new Date|Date object to format|
|mask         |Format mask          |
|utc=false    |UTC or not           |
|gmt=false    |GMT or not           |
|return       |Formatted duration   |

|Mask|Desc                                                             |
|----|-----------------------------------------------------------------|
|d   |Day of the month as digits; no leading zero for single-digit days|
|dd  |Day of the month as digits; leading zero for single-digit days   |
|ddd |Day of the week as a three-letter abbreviation                   |
|dddd|Day of the week as its full name                                 |
|m   |Month as digits; no leading zero for single-digit months         |
|mm  |Month as digits; leading zero for single-digit months            |
|mmm |Month as a three-letter abbreviation                             |
|mmmm|Month as its full name                                           |
|yy  |Year as last two digits; leading zero for years less than 10     |
|yyyy|Year represented by four digits                                  |
|h   |Hours; no leading zero for single-digit hours (12-hour clock)    |
|hh  |Hours; leading zero for single-digit hours (12-hour clock)       |
|H   |Hours; no leading zero for single-digit hours (24-hour clock)    |
|HH  |Hours; leading zero for single-digit hours (24-hour clock)       |
|M   |Minutes; no leading zero for single-digit minutes                |
|MM  |Minutes; leading zero for single-digit minutes                   |
|s   |Seconds; no leading zero for single-digit seconds                |
|ss  |Seconds; leading zero for single-digit seconds                   |
|l L |Milliseconds. l gives 3 digits. L gives 2 digits                 |
|t   |Lowercase, single-character time marker string: a or p           |
|tt  |Lowercase, two-character time marker string: am or pm            |
|T   |Uppercase, single-character time marker string: A or P           |
|TT  |Uppercase, two-character time marker string: AM or PM            |
|Z   |US timezone abbreviation, e.g. EST or MDT                        |
|o   |GMT/UTC timezone offset, e.g. -0500 or +0230                     |
|S   |The date's ordinal suffix (st, nd, rd, or th)                    |
|UTC:|Must be the first four characters of the mask                    |

```javascript
dateFormat('isoDate'); // -> 2016-11-19
dateFormat('yyyy-mm-dd HH:MM:ss'); // -> 2016-11-19 19:00:04
dateFormat(new Date(), 'yyyy-mm-dd'); // -> 2016-11-19
```

## debounce 

Return a new debounced version of the passed function.

|Name  |Desc                           |
|------|-------------------------------|
|fn    |Function to debounce           |
|wait  |Number of milliseconds to delay|
|return|New debounced function         |

```javascript
const calLayout = debounce(function() {}, 300);
// $(window).resize(calLayout);
```

## decodeUriComponent 

Better decodeURIComponent that does not throw if input is invalid.

|Name  |Desc            |
|------|----------------|
|str   |String to decode|
|return|Decoded string  |

```javascript
decodeUriComponent('%%25%'); // -> '%%%'
decodeUriComponent('%E0%A4%A'); // -> '\xE0\xA4%A'
```

## defaults 

Fill in undefined properties in object with the first value present in the following list of defaults objects.

|Name  |Desc              |
|------|------------------|
|obj   |Destination object|
|...src|Sources objects   |
|return|Destination object|

```javascript
defaults({ name: 'RedHood' }, { name: 'Unknown', age: 24 }); // -> {name: 'RedHood', age: 24}
```

## delegate 

Event delegation.

### add

Add event delegation.

|Name    |Desc          |
|--------|--------------|
|el      |Parent element|
|type    |Event type    |
|selector|Match selector|
|cb      |Event callback|

### remove

Remove event delegation.

```javascript
const container = document.getElementById('container');
function clickHandler() {
    // Do something...
}
delegate.add(container, 'click', '.children', clickHandler);
delegate.remove(container, 'click', '.children', clickHandler);
```

## detectBrowser 

Detect browser info using ua.

|Name                  |Desc                              |
|----------------------|----------------------------------|
|ua=navigator.userAgent|Browser userAgent                 |
|return                |Object containing name and version|

Browsers supported: ie, chrome, edge, firefox, opera, safari, ios(mobile safari), android(android browser)

```javascript
const browser = detectBrowser();
if (browser.name === 'ie' && browser.version < 9) {
    // Do something about old IE...
}
```

## detectOs 

Detect operating system using ua.

|Name                  |Desc                 |
|----------------------|---------------------|
|ua=navigator.userAgent|Browser userAgent    |
|return                |Operating system name|

Supported os: windows, os x, linux, ios, android, windows phone

```javascript
if (detectOs() === 'ios') {
    // Do something about ios...
}
```

## difference 

Create an array of unique array values not included in the other given array.

|Name   |Desc                        |
|-------|----------------------------|
|arr    |Array to inspect            |
|...args|Values to exclude           |
|return |New array of filtered values|

```javascript
difference([3, 2, 1], [4, 2]); // -> [3, 1]
```

## each 

Iterate over elements of collection and invokes iterator for each element.

|Name    |Desc                          |
|--------|------------------------------|
|obj     |Collection to iterate over    |
|iterator|Function invoked per iteration|
|ctx     |Function context              |

```javascript
each({ a: 1, b: 2 }, function(val, key) {});
```

## endWith 

Check if string ends with the given target string.

|Name  |Desc                           |
|------|-------------------------------|
|str   |The string to search           |
|suffix|String suffix                  |
|return|True if string ends with target|

```javascript
endWith('ab', 'b'); // -> true
```

## escape 

Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.

|Name  |Desc            |
|------|----------------|
|str   |String to escape|
|return|Escaped string  |

```javascript
escape('You & Me'); // -> 'You &amp; Me'
```

## escapeJsStr 

Escape string to be a valid JavaScript string literal between quotes.

http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4

|Name  |Desc            |
|------|----------------|
|str   |String to escape|
|return|Escaped string  |

```javascript
escapeJsStr('"\n'); // -> '\\"\\\\n'
```

## escapeJsonStr 

Escape json string.

## escapeRegExp 

Escape special chars to be used as literals in RegExp constructors.

|Name  |Desc            |
|------|----------------|
|str   |String to escape|
|return|Escaped string  |

```javascript
escapeRegExp('[licia]'); // -> '\\[licia\\]'
```

## extend 

Copy all of the properties in the source objects over to the destination object.

|Name       |Desc              |
|-----------|------------------|
|destination|Destination object|
|...sources |Sources objects   |
|return     |Destination object|

```javascript
extend({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
```

## extendOwn 

Like extend, but only copies own properties over to the destination object.

|Name       |Desc              |
|-----------|------------------|
|destination|Destination object|
|...sources |Sources objects   |
|return     |Destination object|

```javascript
extendOwn({ name: 'RedHood' }, { age: 24 }); // -> {name: 'RedHood', age: 24}
```

## extractUrls 

Extract urls from plain text.

|Name  |Desc           |
|------|---------------|
|str   |Text to extract|
|return|Url list       |

```javascript
const str =
    '[Official site: http://eustia.liriliri.io](http://eustia.liriliri.io)';
extractUrls(str); // -> ['http://eustia.liriliri.io']
```

## fileSize 

Turn bytes into human readable file size.

|Name  |Desc              |
|------|------------------|
|bytes |File bytes        |
|return|Readable file size|

```javascript
fileSize(5); // -> '5'
fileSize(1500); // -> '1.46K'
fileSize(1500000); // -> '1.43M'
fileSize(1500000000); // -> '1.4G'
fileSize(1500000000000); // -> '1.36T'
```

## filter 

Iterates over elements of collection, returning an array of all the values that pass a truth test.

|Name     |Desc                                   |
|---------|---------------------------------------|
|obj      |Collection to iterate over             |
|predicate|Function invoked per iteration         |
|ctx      |Predicate context                      |
|return   |Array of all values that pass predicate|

```javascript
filter([1, 2, 3, 4, 5], function(val) {
    return val % 2 === 0;
}); // -> [2, 4]
```

## flatten 

Recursively flatten an array.

|Name  |Desc               |
|------|-------------------|
|arr   |Array to flatten   |
|return|New flattened array|

```javascript
flatten(['a', ['b', ['c']], 'd', ['e']]); // -> ['a', 'b', 'c', 'd', 'e']
```

## freeze 

Shortcut for Object.freeze.

Use Object.defineProperties if Object.freeze is not supported.

|Name  |Desc            |
|------|----------------|
|obj   |Object to freeze|
|return|Object passed in|

```javascript
const a = { b: 1 };
freeze(a);
a.b = 2;
console.log(a); // -> {b: 1}
```

## fullUrl 

Add origin to url if needed.

## getFileName 

Extract file name from url.

## getObjType 

Get object type.

## getProto 

Get prototype of an object.

|Name  |Desc                                         |
|------|---------------------------------------------|
|obj   |Target object                                |
|return|Prototype of given object, null if not exists|

```javascript
const a = {};
getProto(Object.create(a)); // -> a
```

## has 

Checks if key is a direct property.

|Name  |Desc                            |
|------|--------------------------------|
|obj   |Object to query                 |
|key   |Path to check                   |
|return|True if key is a direct property|

```javascript
has({ one: 1 }, 'one'); // -> true
```

## highlight 

Highlight code.

|Name   |Desc                        |
|-------|----------------------------|
|str    |Code string                 |
|lang=js|Language, js, html or css   |
|style  |Keyword highlight style     |
|return |Highlighted html code string|

Available styles:

comment, string, number, keyword, operator

```javascript
highlight('const a = 5;', 'js', {
    keyword: 'color:#569cd6;'
}); // -> '<span style="color:#569cd6;">const</span> a <span style="color:#994500;">=</span> <span style="color:#0086b3;">5</span>;'
```

## identity 

Return the first argument given.

|Name  |Desc       |
|------|-----------|
|val   |Any value  |
|return|Given value|

```javascript
identity('a'); // -> 'a'
```

## idxOf 

Get the index at which the first occurrence of value.

|Name     |Desc                |
|---------|--------------------|
|arr      |Array to search     |
|val      |Value to search for |
|fromIdx=0|Index to search from|
|return   |Value index         |

```javascript
idxOf([1, 2, 1, 2], 2, 2); // -> 3
```

## inherits 

Inherit the prototype methods from one constructor into another.

|Name      |Desc       |
|----------|-----------|
|Class     |Child Class|
|SuperClass|Super Class|

```javascript
function People(name) {
    this._name = name;
}
People.prototype = {
    getName: function() {
        return this._name;
    }
};
function Student(name) {
    this._name = name;
}
inherits(Student, People);
const s = new Student('RedHood');
s.getName(); // -> 'RedHood'
```

## isArgs 

Check if value is classified as an arguments object.

|Name  |Desc                                |
|------|------------------------------------|
|val   |Value to check                      |
|return|True if value is an arguments object|

```javascript
isArgs(
    (function() {
        return arguments;
    })()
); // -> true
```

## isArr 

Check if value is an `Array` object.

|Name  |Desc                              |
|------|----------------------------------|
|val   |Value to check                    |
|return|True if value is an `Array` object|

```javascript
isArr([]); // -> true
isArr({}); // -> false
```

## isArrLike 

Check if value is array-like.

|Name  |Desc                       |
|------|---------------------------|
|val   |Value to check             |
|return|True if value is array like|

Function returns false.

```javascript
isArrLike('test'); // -> true
isArrLike(document.body.children); // -> true;
isArrLike([1, 2, 3]); // -> true
```

## isBool 

Check if value is a boolean primitive.

|Name  |Desc                      |
|------|--------------------------|
|val   |Value to check            |
|return|True if value is a boolean|

```javascript
isBool(true); // -> true
isBool(false); // -> true
isBool(1); // -> false
```

## isBrowser 

Check if running in a browser.

```javascript
console.log(isBrowser); // -> true if running in a browser
```

## isBuffer 

Check if value is a buffer.

|Name  |Desc                     |
|------|-------------------------|
|val   |The value to check       |
|return|True if value is a buffer|

```javascript
isBuffer(new Buffer(4)); // -> true
```

## isCrossOrig 

Check if a url is cross origin.

## isDarkMode 

Detect dark mode.

```javascript
console.log(isDarkMode()); // true if dark mode
```

## isDate 

Check if value is classified as a Date object.

|Name  |Desc                          |
|------|------------------------------|
|val   |value to check                |
|return|True if value is a Date object|

```javascript
isDate(new Date()); // -> true
```

## isEl 

Check if value is a DOM element.

|Name  |Desc                          |
|------|------------------------------|
|val   |Value to check                |
|return|True if value is a DOM element|

```javascript
isEl(document.body); // -> true
```

## isEmpty 

Check if value is an empty object or array.

|Name  |Desc                  |
|------|----------------------|
|val   |Value to check        |
|return|True if value is empty|

```javascript
isEmpty([]); // -> true
isEmpty({}); // -> true
isEmpty(''); // -> true
```

## isErr 

Check if value is an error.

|Name  |Desc                     |
|------|-------------------------|
|val   |Value to check           |
|return|True if value is an error|

```javascript
isErr(new Error()); // -> true
```

## isFn 

Check if value is a function.

|Name  |Desc                       |
|------|---------------------------|
|val   |Value to check             |
|return|True if value is a function|

Generator function is also classified as true.

```javascript
isFn(function() {}); // -> true
isFn(function*() {}); // -> true
isFn(async function() {}); // -> true
```

## isHidden 

Check if element is hidden.

|Name   |Desc                     |
|-------|-------------------------|
|el     |Target element           |
|options|Check options            |
|return |True if element is hidden|

Available options:

|Name            |Desc                         |
|----------------|-----------------------------|
|display=true    |Check if it is displayed     |
|visibility=false|Check visibility css property|
|opacity=false   |Check opacity css property   |
|size=false      |Check width and height       |
|viewport=false  |Check if it is in viewport   |
|overflow=false  |Check if hidden in overflow  |

```javascript
isHidden(document.createElement('div')); // -> true
```

## isMatch 

Check if keys and values in src are contained in obj.

|Name  |Desc                              |
|------|----------------------------------|
|obj   |Object to inspect                 |
|src   |Object of property values to match|
|return|True if object is match           |

```javascript
isMatch({ a: 1, b: 2 }, { a: 1 }); // -> true
```

## isMiniProgram 

Check if running in wechat mini program.

```javascript
console.log(isMiniProgram); // -> true if running in mini program.
```

## isMobile 

Check whether client is using a mobile browser using ua.

|Name                  |Desc                                 |
|----------------------|-------------------------------------|
|ua=navigator.userAgent|User agent                           |
|return                |True if ua belongs to mobile browsers|

```javascript
isMobile(navigator.userAgent);
```

## isNaN 

Check if value is an NaN.

|Name  |Desc                   |
|------|-----------------------|
|val   |Value to check         |
|return|True if value is an NaN|

Undefined is not an NaN, different from global isNaN function.

```javascript
isNaN(0); // -> false
isNaN(NaN); // -> true
```

## isNative 

Check if value is a native function.

|Name  |Desc                              |
|------|----------------------------------|
|val   |Value to check                    |
|return|True if value is a native function|

```javascript
isNative(function() {}); // -> false
isNative(Math.min); // -> true
```

## isNil 

Check if value is null or undefined, the same as value == null.

|Name  |Desc                              |
|------|----------------------------------|
|val   |Value to check                    |
|return|True if value is null or undefined|

```javascript
isNil(null); // -> true
isNil(void 0); // -> true
isNil(undefined); // -> true
isNil(false); // -> false
isNil(0); // -> false
isNil([]); // -> false
```

## isNull 

Check if value is an Null.

|Name  |Desc                    |
|------|------------------------|
|val   |Value to check          |
|return|True if value is an Null|

```javascript
isNull(null); // -> true
```

## isNum 

Check if value is classified as a Number primitive or object.

|Name  |Desc                                 |
|------|-------------------------------------|
|val   |Value to check                       |
|return|True if value is correctly classified|

```javascript
isNum(5); // -> true
isNum(5.1); // -> true
isNum({}); // -> false
```

## isObj 

Check if value is the language type of Object.

|Name  |Desc                      |
|------|--------------------------|
|val   |Value to check            |
|return|True if value is an object|

[Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)

```javascript
isObj({}); // -> true
isObj([]); // -> true
```

## isPrimitive 

Check if value is string, number, boolean or null.

|Name  |Desc                        |
|------|----------------------------|
|val   |Value to check              |
|return|True if value is a primitive|

```javascript
isPrimitive(5); // -> true
isPrimitive('abc'); // -> true
isPrimitive(false); // -> true
```

## isPromise 

Check if value looks like a promise.

|Name  |Desc                              |
|------|----------------------------------|
|val   |Value to check                    |
|return|True if value looks like a promise|

```javascript
isPromise(new Promise(function() {})); // -> true
isPromise({}); // -> false
```

## isRegExp 

Check if value is a regular expression.

|Name  |Desc                                 |
|------|-------------------------------------|
|val   |Value to check                       |
|return|True if value is a regular expression|

```javascript
isRegExp(/a/); // -> true
```

## isSorted 

Check if an array is sorted.

|Name  |Desc                   |
|------|-----------------------|
|arr   |Array to check         |
|cmp   |Comparator             |
|return|True if array is sorted|

```javascript
isSorted([1, 2, 3]); // -> true
isSorted([3, 2, 1]); // -> false
```

## isStr 

Check if value is a string primitive.

|Name  |Desc                               |
|------|-----------------------------------|
|val   |Value to check                     |
|return|True if value is a string primitive|

```javascript
isStr('licia'); // -> true
```

## isUndef 

Check if value is undefined.

|Name  |Desc                      |
|------|--------------------------|
|val   |Value to check            |
|return|True if value is undefined|

```javascript
isUndef(void 0); // -> true
isUndef(null); // -> false
```

## kebabCase 

Convert string to "kebabCase".

|Name  |Desc              |
|------|------------------|
|str   |String to convert |
|return|Kebab cased string|

```javascript
kebabCase('fooBar'); // -> foo-bar
kebabCase('foo bar'); // -> foo-bar
kebabCase('foo_bar'); // -> foo-bar
kebabCase('foo.bar'); // -> foo-bar
```

## keys 

Create an array of the own enumerable property names of object.

|Name  |Desc                   |
|------|-----------------------|
|obj   |Object to query        |
|return|Array of property names|

```javascript
keys({ a: 1 }); // -> ['a']
```

## last 

Get the last element of array.

|Name  |Desc                     |
|------|-------------------------|
|arr   |The array to query       |
|return|The last element of array|

```javascript
last([1, 2]); // -> 2
```

## linkify 

Hyperlink urls in a string.

|Name     |Desc                     |
|---------|-------------------------|
|str      |String to hyperlink      |
|hyperlink|Function to hyperlink url|
|return   |Result string            |

```javascript
const str = 'Official site: http://eustia.liriliri.io';
linkify(str); // -> 'Official site: <a href="http://eustia.liriliri.io">http://eustia.liriliri.io</a>'
linkify(str, function(url) {
    return '<a href="' + url + '" target="_blank">' + url + '</a>';
});
```

## loadJs 

Inject script tag into page with given src value.

|Name|Desc           |
|----|---------------|
|src |Script source  |
|cb  |Onload callback|

```javascript
loadJs('main.js', function(isLoaded) {
    // Do something...
});
```

## lowerCase 

Convert string to lower case.

|Name  |Desc              |
|------|------------------|
|str   |String to convert |
|return|Lower cased string|

```javascript
lowerCase('TEST'); // -> 'test'
```

## lpad 

Pad string on the left side if it's shorter than length.

|Name  |Desc                  |
|------|----------------------|
|str   |String to pad         |
|len   |Padding length        |
|chars |String used as padding|
|return|Result string         |

```javascript
lpad('a', 5); // -> '    a'
lpad('a', 5, '-'); // -> '----a'
lpad('abc', 3, '-'); // -> 'abc'
lpad('abc', 5, 'ab'); // -> 'ababc'
```

## ltrim 

Remove chars or white-spaces from beginning of string.

|Name  |Desc              |
|------|------------------|
|str   |String to trim    |
|chars |Characters to trim|
|return|Trimmed string    |

```javascript
ltrim(' abc  '); // -> 'abc  '
ltrim('_abc_', '_'); // -> 'abc_'
ltrim('_abc_', ['a', '_']); // -> 'bc_'
```

## map 

Create an array of values by running each element in collection through iteratee.

|Name    |Desc                          |
|--------|------------------------------|
|object  |Collection to iterate over    |
|iterator|Function invoked per iteration|
|context |Function context              |
|return  |New mapped array              |

```javascript
map([4, 8], function(n) {
    return n * n;
}); // -> [16, 64]
```

## mapObj 

Map for objects.

|Name    |Desc                          |
|--------|------------------------------|
|object  |Object to iterate over        |
|iterator|Function invoked per iteration|
|context |Function context              |
|return  |New mapped object             |

```javascript
mapObj({ a: 1, b: 2 }, function(val, key) {
    return val + 1;
}); // -> {a: 2, b: 3}
```

## matcher 

Return a predicate function that checks if attrs are contained in an object.

|Name  |Desc                              |
|------|----------------------------------|
|attrs |Object of property values to match|
|return|New predicate function            |

```javascript
const filter = require('licia/filter');

const objects = [
    { a: 1, b: 2, c: 3 },
    { a: 4, b: 5, c: 6 }
];
filter(objects, matcher({ a: 4, c: 6 })); // -> [{a: 4, b: 5, c: 6}]
```

## memStorage 

Memory-backed implementation of the Web Storage API.

A replacement for environments where localStorage or sessionStorage is not available.

```javascript
const localStorage = window.localStorage || memStorage;
localStorage.setItem('test', 'licia');
```

## memoize 

Memoize a given function by caching the computed result.

|Name  |Desc                                |
|------|------------------------------------|
|fn    |Function to have its output memoized|
|hashFn|Function to create cache key        |
|return|New memoized function               |

```javascript
const fibonacci = memoize(function(n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
});
```

## meta 

Document meta manipulation, turn name and content into key value pairs.

Get meta content with given name. If name is omitted, all pairs will be return.

|Name  |Desc        |
|------|------------|
|name  |Meta name   |
|return|Meta content|

Set meta content.

|Name   |Desc        |
|-------|------------|
|name   |Meta name   |
|content|Meta content|

|Name |Desc                        |
|-----|----------------------------|
|metas|Object of name content pairs|

### remove

Remove metas.

|Name|Desc     |
|----|---------|
|name|Meta name|

```javascript
// <meta name="a" content="1"/> <meta name="b" content="2"/> <meta name="c" content="3"/>
meta(); // -> {a: '1', b: '2', c: '3'}
meta('a'); // -> '1'
meta(['a', 'c']); // -> {a: '1', c: '3'}
meta('d', '4');
meta({
    d: '5',
    e: '6',
    f: '7'
});
meta.remove('d');
meta.remove(['e', 'f']);
```

## ms 

Convert time string formats to milliseconds.

Turn time string into milliseconds.

|Name  |Desc         |
|------|-------------|
|str   |String format|
|return|Milliseconds |

Turn milliseconds into time string.

|Name  |Desc         |
|------|-------------|
|num   |Milliseconds |
|return|String format|

```javascript
ms('1s'); // -> 1000
ms('1m'); // -> 60000
ms('1.5h'); // -> 5400000
ms('1d'); // -> 86400000
ms('1y'); // -> 31557600000
ms('1000'); // -> 1000
ms(1500); // -> '1.5s'
ms(60000); // -> '1m'
```

## nextTick 

Next tick for both node and browser.

|Name|Desc            |
|----|----------------|
|cb  |Function to call|

Use process.nextTick if available.

Otherwise setImmediate or setTimeout is used as fallback.

```javascript
nextTick(function() {
    // Do something...
});
```

## noop 

A no-operation function.

```javascript
noop(); // Does nothing
```

## now 

Gets the number of milliseconds that have elapsed since the Unix epoch.

```javascript
now(); // -> 1468826678701
```

## objToStr 

Alias of Object.prototype.toString.

|Name  |Desc                                |
|------|------------------------------------|
|val   |Source value                        |
|return|String representation of given value|

```javascript
objToStr(5); // -> '[object Number]'
```

## once 

Create a function that invokes once.

|Name  |Desc                   |
|------|-----------------------|
|fn    |Function to restrict   |
|return|New restricted function|

```javascript
function init() {}
const initOnce = once(init);
initOnce();
initOnce(); // -> init is invoked once
```

## optimizeCb 

Used for function context binding.

## orientation 

Screen orientation helper.

### on

Bind change event.

### off

Unbind change event.

### get

Get current orientation(landscape or portrait).

```javascript
orientation.on('change', function(direction) {
    console.log(direction); // -> 'portrait'
});
orientation.get(); // -> 'landscape'
```

## partial 

Partially apply a function by filling in given arguments.

|Name       |Desc                                    |
|-----------|----------------------------------------|
|fn         |Function to partially apply arguments to|
|...partials|Arguments to be partially applied       |
|return     |New partially applied function          |

```javascript
const sub5 = partial(function(a, b) {
    return b - a;
}, 5);
sub5(20); // -> 15
```

## perfNow 

High resolution time up to microsecond precision.

```javascript
const start = perfNow();

// Do something.

console.log(perfNow() - start);
```

## pick 

Return a filtered copy of an object.

|Name  |Desc           |
|------|---------------|
|object|Source object  |
|filter|Object filter  |
|return|Filtered object|

```javascript
pick({ a: 1, b: 2 }, 'a'); // -> {a: 1}
pick({ a: 1, b: 2, c: 3 }, ['b', 'c']); // -> {b: 2, c: 3}
pick({ a: 1, b: 2, c: 3, d: 4 }, function(val, key) {
    return val % 2;
}); // -> {a: 1, c: 3}
```

## prefix 

Add vendor prefixes to a CSS attribute.

|Name  |Desc                  |
|------|----------------------|
|name  |Property name         |
|return|Prefixed property name|

### dash

Create a dasherize version.

```javascript
prefix('text-emphasis'); // -> 'WebkitTextEmphasis'
prefix.dash('text-emphasis'); // -> '-webkit-text-emphasis'
prefix('color'); // -> 'color'
```

## property 

Return a function that will itself return the key property of any passed-in object.

|Name  |Desc                       |
|------|---------------------------|
|path  |Path of the property to get|
|return|New accessor function      |

```javascript
const obj = { a: { b: 1 } };
property('a')(obj); // -> {b: 1}
property(['a', 'b'])(obj); // -> 1
```

## pxToNum 

Turn string like '0px' to number.

## query 

Parse and stringify url query strings.

### parse

Parse a query string into an object.

|Name  |Desc        |
|------|------------|
|str   |Query string|
|return|Query object|

### stringify

Stringify an object into a query string.

|Name  |Desc        |
|------|------------|
|obj   |Query object|
|return|Query string|

```javascript
query.parse('foo=bar&eruda=true'); // -> {foo: 'bar', eruda: 'true'}
query.stringify({ foo: 'bar', eruda: 'true' }); // -> 'foo=bar&eruda=true'
query.parse('name=eruda&name=eustia'); // -> {name: ['eruda', 'eustia']}
```

## raf 

Shortcut for requestAnimationFrame.

Use setTimeout if native requestAnimationFrame is not supported.

```javascript
const id = raf(function tick() {
    // Animation stuff
    raf(tick);
});
raf.cancel(id);
```

## repeat 

Repeat string n-times.

|Name  |Desc            |
|------|----------------|
|str   |String to repeat|
|n     |Repeat times    |
|return|Repeated string |

```javascript
repeat('a', 3); // -> 'aaa'
repeat('ab', 2); // -> 'abab'
repeat('*', 0); // -> ''
```

## restArgs 

This accumulates the arguments passed into an array, after a given index.

|Name      |Desc                                   |
|----------|---------------------------------------|
|function  |Function that needs rest parameters    |
|startIndex|The start index to accumulates         |
|return    |Generated function with rest parameters|

```javascript
const paramArr = restArgs(function(rest) {
    return rest;
});
paramArr(1, 2, 3, 4); // -> [1, 2, 3, 4]
```

## reverse 

Reverse array without mutating it.

|Name  |Desc           |
|------|---------------|
|arr   |Array to modify|
|return|Reversed array |

```javascript
reverse([1, 2, 3]); // -> [3, 2, 1]
```

## rmCookie 

Loop through all possible path and domain to remove cookie.

|Name|Desc      |
|----|----------|
|key |Cookie key|

```javascript
rmCookie('test');
```

## root 

Root object reference, `global` in nodeJs, `window` in browser.

## rtrim 

Remove chars or white-spaces from end of string.

|Name  |Desc              |
|------|------------------|
|str   |String to trim    |
|chars |Characters to trim|
|return|Trimmed string    |

```javascript
rtrim(' abc  '); // -> ' abc'
rtrim('_abc_', '_'); // -> '_abc'
rtrim('_abc_', ['c', '_']); // -> '_ab'
```

## safeCb 

Create callback based on input value.

## safeGet 

Get object property, don't throw undefined error.

|Name  |Desc                     |
|------|-------------------------|
|obj   |Object to query          |
|path  |Path of property to get  |
|return|Target value or undefined|

```javascript
const obj = { a: { aa: { aaa: 1 } } };
safeGet(obj, 'a.aa.aaa'); // -> 1
safeGet(obj, ['a', 'aa']); // -> {aaa: 1}
safeGet(obj, 'a.b'); // -> undefined
```

## safeStorage 

Safe localStorage and sessionStorage.

## slice 

Create slice of source array or array-like object.

|Name            |Desc                      |
|----------------|--------------------------|
|array           |Array to slice            |
|start=0         |Start position            |
|end=array.length|End position, not included|

```javascript
slice([1, 2, 3, 4], 1, 2); // -> [2]
```

## some 

Check if predicate return truthy for any element.

|Name     |Desc                                          |
|---------|----------------------------------------------|
|obj      |Collection to iterate over                    |
|predicate|Function to invoked per iteration             |
|ctx      |Predicate context                             |
|return   |True if any element passes the predicate check|

```javascript
some([2, 5], function(val) {
    return val % 2 === 0;
}); // -> true
```

## sortKeys 

Sort keys of an object.

|Name   |Desc                   |
|-------|-----------------------|
|obj    |Object to sort         |
|options|Sort options           |
|return |Object with sorted keys|

Available options:

|Name      |Desc                 |
|----------|---------------------|
|deep=false|Sort keys recursively|
|comparator|Comparator           |

```javascript
sortKeys(
    { b: { d: 2, c: 1 }, a: 0 },
    {
        deep: true
    }
); // -> {a: 0, b: {c: 1, d: 2}}
```

## splitCase 

Split different string case to an array.

|Name  |Desc           |
|------|---------------|
|str   |String to split|
|return|Result array   |

```javascript
splitCase('foo-bar'); // -> ['foo', 'bar']
splitCase('foo bar'); // -> ['foo', 'bar']
splitCase('foo_bar'); // -> ['foo', 'bar']
splitCase('foo.bar'); // -> ['foo', 'bar']
splitCase('fooBar'); // -> ['foo', 'bar']
splitCase('foo-Bar'); // -> ['foo', 'bar']
```

## startWith 

Check if string starts with the given target string.

|Name  |Desc                             |
|------|---------------------------------|
|str   |String to search                 |
|prefix|String prefix                    |
|return|True if string starts with prefix|

```javascript
startWith('ab', 'a'); // -> true
```

## stringify 

JSON stringify with support for circular object, function etc.

Undefined is treated as null value.

|Name  |Desc               |
|------|-------------------|
|obj   |Object to stringify|
|spaces|Indent spaces      |
|return|Stringified object |

```javascript
stringify({ a: function() {} }); // -> '{"a":"[Function function () {}]"}'
const obj = { a: 1, b: {} };
obj.b = obj;
stringify(obj); // -> '{"a":1,"b":"[Circular ~]"}'
```

## stringifyAll 

Stringify object into json with types.

|Name   |Desc               |
|-------|-------------------|
|obj    |Object to stringify|
|options|Stringify options  |
|return |Stringified object |

Available options:

|Name              |Desc                     |
|------------------|-------------------------|
|unenumerable=false|Include unenumerable keys|
|symbol=false      |Include symbol keys      |
|accessGetter=false|Access getter value      |
|timeout=0         |Timeout of stringify     |
|depth=0           |Max depth of recursion   |
|ignore            |Values to ignore         |

When time is out, all remaining values will all be "Timeout".

```javascript
stringifyAll(function test() {}); // -> '{"value":"function test() {}","type":"Function",...}'
```

## throttle 

Return a new throttled version of the passed function.

|Name  |Desc                           |
|------|-------------------------------|
|fn    |Function to throttle           |
|wait  |Number of milliseconds to delay|
|return|New throttled function         |

```javascript
const updatePos = throttle(function() {}, 100);
// $(window).scroll(updatePos);
```

## toArr 

Convert value to an array.

|Name  |Desc            |
|------|----------------|
|val   |Value to convert|
|return|Converted array |

```javascript
toArr({ a: 1, b: 2 }); // -> [{a: 1, b: 2}]
toArr('abc'); // -> ['abc']
toArr(1); // -> [1]
toArr(null); // -> []
```

## toInt 

Convert value to an integer.

|Name  |Desc             |
|------|-----------------|
|val   |Value to convert |
|return|Converted integer|

```javascript
toInt(1.1); // -> 1
toInt(undefined); // -> 0
```

## toNum 

Convert value to a number.

|Name  |Desc            |
|------|----------------|
|val   |Value to process|
|return|Result number   |

```javascript
toNum('5'); // -> 5
```

## toSrc 

Convert function to its source code.

|Name  |Desc               |
|------|-------------------|
|fn    |Function to convert|
|return|Source code        |

```javascript
toSrc(Math.min); // -> 'function min() { [native code] }'
toSrc(function() {}); // -> 'function () { }'
```

## toStr 

Convert value to a string.

|Name  |Desc            |
|------|----------------|
|val   |Value to convert|
|return|Result string   |

```javascript
toStr(null); // -> ''
toStr(1); // -> '1'
toStr(false); // -> 'false'
toStr([1, 2, 3]); // -> '1,2,3'
```

## trim 

Remove chars or white-spaces from beginning end of string.

|Name  |Desc              |
|------|------------------|
|str   |String to trim    |
|chars |Characters to trim|
|return|Trimmed string    |

```javascript
trim(' abc  '); // -> 'abc'
trim('_abc_', '_'); // -> 'abc'
trim('_abc_', ['a', 'c', '_']); // -> 'b'
```

## type 

Determine the internal JavaScript [[Class]] of an object.

|Name          |Desc             |
|--------------|-----------------|
|val           |Value to get type|
|lowerCase=true|LowerCase result |
|return        |Type of object   |

```javascript
type(5); // -> 'number'
type({}); // -> 'object'
type(function() {}); // -> 'function'
type([]); // -> 'array'
type([], false); // -> 'Array'
type(async function() {}, false); // -> 'AsyncFunction'
```

## types 

Used for typescript definitions only.

## ucs2 

UCS-2 encoding and decoding.

### encode

Create a string using an array of code point values.

|Name  |Desc                |
|------|--------------------|
|arr   |Array of code points|
|return|Encoded string      |

### decode

Create an array of code point values using a string.

|Name  |Desc                |
|------|--------------------|
|str   |Input string        |
|return|Array of code points|

```javascript
ucs2.encode([0x61, 0x62, 0x63]); // -> 'abc'
ucs2.decode('abc'); // -> [0x61, 0x62, 0x63]
'𝌆'.length; // -> 2
ucs2.decode('𝌆').length; // -> 1
```

## uncaught 

Handle global uncaught errors and promise rejections.

### start

Start handling of errors.

### stop

Stop handling.

### addListener

Add listener for handling errors.

|Name|Desc          |
|----|--------------|
|fn  |Error listener|

### rmListener

Remove listener.

### rmAllListeners

Remove all listeners.

```javascript
uncaught.start();
uncaught.addListener(err => {
    // Do something.
});
```

## uniqId 

Generate a globally-unique id.

|Name  |Desc              |
|------|------------------|
|prefix|Id prefix         |
|return|Globally-unique id|

```javascript
uniqId('eustia_'); // -> 'eustia_xxx'
```

## unique 

Create duplicate-free version of an array.

|Name  |Desc                         |
|------|-----------------------------|
|arr   |Array to inspect             |
|cmp   |Function for comparing values|
|return|New duplicate free array     |

```javascript
unique([1, 2, 3, 1]); // -> [1, 2, 3]
```

## upperFirst 

Convert the first character of string to upper case.

|Name  |Desc             |
|------|-----------------|
|str   |String to convert|
|return|Converted string |

```javascript
upperFirst('red'); // -> Red
```

## utf8 

UTF-8 encoding and decoding.

### encode

Turn any UTF-8 decoded string into UTF-8 encoded string.

|Name  |Desc            |
|------|----------------|
|str   |String to encode|
|return|Encoded string  |

### decode

Turn any UTF-8 encoded string into UTF-8 decoded string.

|Name      |Desc                  |
|----------|----------------------|
|str       |String to decode      |
|safe=false|Suppress error if true|
|return    |Decoded string        |

```javascript
utf8.encode('\uD800\uDC00'); // ->  '\xF0\x90\x80\x80'
utf8.decode('\xF0\x90\x80\x80'); // -> '\uD800\uDC00'
```

## values 

Create an array of the own enumerable property values of object.

|Name  |Desc                    |
|------|------------------------|
|obj   |Object to query         |
|return|Array of property values|

```javascript
values({ one: 1, two: 2 }); // -> [1, 2]
```

## viewportScale 

Get viewport scale.

```javascript
viewportScale(); // -> 3
```

## wrap 

Wrap the function inside a wrapper function, passing it as the first argument.

|Name   |Desc            |
|-------|----------------|
|fn     |Function to wrap|
|wrapper|Wrapper function|
|return |New function    |

```javascript
const p = wrap(escape, function(fn, text) {
    return '<p>' + fn(text) + '</p>';
});
p('You & Me'); // -> '<p>You &amp; Me</p>'
```

## xpath 

Select elements using xpath, IE is not supported.

|Name  |Desc           |
|------|---------------|
|xpath |Xpath          |
|return|Target elements|

```javascript
xpath('//html/body'); // -> [body]
```
