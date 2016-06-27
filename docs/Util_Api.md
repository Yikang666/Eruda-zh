# Eustia Documentation

## last 

Get the last element of array.

 |Name  |Type |Desc                     |
 |------|-----|-------------------------|
 |arr   |array|The array to query       |
 |return|*    |The last element of array|

 ```javascript
 last([1, 2]); // -> 2
 ```

## isUndef 

Check if value is undefined.

 |Name  |Type   |Desc                      |
 |------|-------|--------------------------|
 |val   |*      |The value to check        |
 |return|boolean|True if value is undefined|

 ```javascript
 isUndef(void 0); // -> true
 isUndef(null); // -> false
 ```

## isObj 

Check if value is the language type of Object.

 |Name  |Type   |Desc                      |
 |------|-------|--------------------------|
 |val   |*      |The value to check        |
 |return|boolean|True if value is an object|

 [Language Spec](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)

 ```javascript
 isObj({}); // -> true
 isObj([]); // -> true
 ```

## inherits 

Inherit the prototype methods from one constructor into another.

 |Name      |Type    |Desc       |
 |----------|--------|-----------|
 |Class     |function|Child Class|
 |SuperClass|function|Super Class|

 ```javascript
 function People(name)
 {
     this._name = name;
 }
 People.prototype = {
     getName: function ()
     {
         return this._name;
     }
 };
 function Student(name)
 {
     this._name = name;
 }
 inherits(Student, People);
 var s = new Student('RedHood');
 s.getName(); // -> 'RedHood'
 ```

## has 

Checks if key is a direct property.

 |Name  |Type   |Desc                            |
 |------|-------|--------------------------------|
 |obj   |object |The object to query             |
 |key   |string |The path to check               |
 |return|boolean|True if key is a direct property|

 ```javascript
 has({one: 1}, 'one'); // -> true
 ```

## slice 

No documentation.

## allKeys 

Retrieve all the names of object's own and inherited properties.

 |Name  |Type  |Desc                           |
 |------|------|-------------------------------|
 |obj   |object|The object to query            |
 |return|array |The array of all property names|

 > Members of Object's prototype won't be retrieved.

 ```javascript
 var obj = Object.create({zero: 0});
 obj.one = 1;
 allKeys(obj) // -> ['zero', 'one']
 ```

## splitCase 

Split different string case to an array.

 |Name  |Type  |Desc           |
 |------|------|---------------|
 |str   |string|String to split|
 |return|array |Result array   |

 ```javascript
 splitCase('foo-bar'); // -> ['foo', 'bar']
 splitCase('foo bar'); // -> ['foo', 'bar']
 splitCase('foo_bar'); // -> ['foo', 'bar']
 splitCase('foo.bar'); // -> ['foo', 'bar']
 splitCase('fooBar'); // -> ['foo', 'bar']
 splitCase('foo-Bar'); // -> ['foo', 'bar']
 ```

## camelCase 

Convert string to "camelCase".

 |Name  |Type  |Desc              |
 |------|------|------------------|
 |str   |string|String to convert |
 |return|string|Camel cased string|

 ```javascript
 camelCase('foo-bar'); // -> fooBar
 camelCase('foo bar'); // -> fooBar
 camelCase('foo_bar'); // -> fooBar
 camelCase('foo.bar'); // -> fooBar
 ```

## kebabCase 

Convert string to "kebabCase".

 |Name  |Type  |Desc              |
 |------|------|------------------|
 |str   |string|String to convert |
 |return|string|Kebab cased string|

 ```javascript
 kebabCase('fooBar'); // -> foo-bar
 kebabCase('foo bar'); // -> foo-bar
 kebabCase('foo_bar'); // -> foo-bar
 kebabCase('foo.bar'); // -> foo-bar
 ```

## idxOf 

Get the index at which the first occurrence of value.

 |Name       |Type  |Desc                |
 |-----------|------|--------------------|
 |arr        |array |Array to search     |
 |val        |*     |Value to search for |
 |[fromIdx=0]|number|Index to search from|

 ```javascript
 idxOf([1, 2, 1, 2], 2, 2); // -> 3
 ```

## keys 

Create an array of the own enumerable property names of object.

 |Name  |Type  |Desc                       |
 |------|------|---------------------------|
 |obj   |object|The object to query        |
 |return|array |The array of property names|

## endWith 

Check if string ends with the given target string.

 |Name  |Type   |Desc                           |
 |------|-------|-------------------------------|
 |str   |string |The string to search           |
 |suffix|string |String suffix                  |
 |return|boolean|True if string ends with target|

 ```javascript
 endWith('ab', 'b'); // -> true
 ```

## escape 

Escapes a string for insertion into HTML, replacing &, <, >, ", `, and ' characters.

 |Name  |Type  |Desc            |
 |------|------|----------------|
 |str   |string|String to escape|
 |return|string|Escaped string  |

 ```javascript
 escape('You & Me'); -> // -> 'You &amp; Me'
 ```

## escapeRegExp 

Escape special chars to be used as literals in RegExp constructors.

 |Name  |Type  |Desc            |
 |------|------|----------------|
 |str   |string|string to escape|
 |return|string|Escaped string  |

 ```javascript
 escapeRegExp('[eris]'); // -> '\\[eris\\]'
 ```

## evalCss 

No documentation.

## get 

No documentation.

## identity 

Return the first argument given.

 |Name  |Type|Desc       |
 |------|----|-----------|
 |val   |*   |Any value  |
 |return|*   |Given value|

 ```javascript
 identity('a'); // -> 'a'
 ```

## objToStr 

Alias of Object.prototype.toString.

 |Name  |Type  |Desc                                    |
 |------|------|----------------------------------------|
 |value |*     |Source value                            |
 |return|string|String representation of the given value|

## isArgs 

Check if value is classified as an arguments object.

 |Name  |Type   |Desc                                |
 |------|-------|------------------------------------|
 |value |*      |Value to check                      |
 |return|boolean|True if value is an arguments object|

 ```javascript
 (function () {
     isArgs(arguments); // -> true
 })();
 ```

## isNum 

Checks if value is classified as a Number primitive or object.

 |Name  |Type   |Desc                                             |
 |------|-------|-------------------------------------------------|
 |value |*      |The value to check                               |
 |return|boolean|True if value is correctly classified, else false|

## isArrLike 

No documentation.

## each 

Iterates over elements of collection and invokes iteratee for each element.

 |Name    |Type         |Desc                          |
 |--------|-------------|------------------------------|
 |obj     |object\|array|Collection to iterate over    |
 |iteratee|function     |Function invoked per iteration|
 |[ctx]   |*            |Function context              |

 ```javascript
 each({'a': 1, 'b': 2}, function (val, key) {});
 ```

## createAssigner 

Used to create extend, extendOwn and defaults.

 |Name    |Type    |Desc                          |
 |--------|--------|------------------------------|
 |keysFn  |function|Function to get object keys   |
 |defaults|boolean |No override when set to true  |
 |return  |function|The result function, extend...|

## defaults 

Fill in undefined properties in object with the first value present in the following list of defaults objects.

 |Name  |Type  |Desc              |
 |------|------|------------------|
 |obj   |object|Destination object|
 |*src  |object|Sources objects   |
 |return|object|Destination object|

 ```javascript
 defaults({name: 'RedHood'}, {name: 'Unknown', age: 24}); // -> {name: 'RedHood', age: 24}
 ```

## cookie 

Simple api for handling browser cookies.

 ## get: get cookie value.

 |Name  |Type  |Desc                      |
 |------|------|--------------------------|
 |key   |string|Cookie key                |
 |return|string|Corresponding cookie value|

 ## set: set cookie value.

 |Name     |Type   |Desc          |
 |---------|-------|--------------|
 |key      |string |Cookie key    |
 |val      |string |Cookie value  |
 |[options]|object |Cookie options|
 |return   |exports|Module cookie |

 ## remove: remove cookie value.

 |Name     |Type   |Desc          |
 |---------|-------|--------------|
 |key      |string |Cookie key    |
 |[options]|object |Cookie options|
 |return   |exports|Module cookie |

 ```javascript
 cookie.set('a', '1', {path: '/'});
 cookie.get('a'); // -> '1'
 cookie.remove('a');
 ```

## extend 

Copy all of the properties in the source objects over to the destination object.

 |Name  |Type  |Desc              |
 |------|------|------------------|
 |obj   |object|Destination object|
 |*src  |object|Sources objects   |
 |return|object|Destination object|

 ```javascript
 extend({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
 ```

## extendOwn 

Like extend, but only copies own properties over to the destination object.

 |Name  |Type  |Desc              |
 |------|------|------------------|
 |obj   |object|Destination object|
 |*src  |object|Sources objects   |
 |return|object|Destination object|

 ```javascript
 extendOwn({name: 'RedHood'}, {age: 24}); // -> {name: 'RedHood', age: 24}
 ```

## values 

Creates an array of the own enumerable property values of object.

 |Name  |Type  |Desc                    |
 |------|------|------------------------|
 |obj   |object|Object to query         |
 |return|array |Array of property values|

 ```javascript
 values({one: 1, two: 2}); // -> [1, 2]
 ```

## contain 

No documentation.

## isStr 

Check if value is a string primitive.

 |Name  |Type   |Desc                               |
 |------|-------|-----------------------------------|
 |val   |*      |The value to check                 |
 |return|boolean|True if value is a string primitive|

 ```javascript
 isStr('eris'); // -> true
 ```

## isArr 

Check if value is an `Array` object.

 |Name  |Type   |Desc                              |
 |------|-------|----------------------------------|
 |val   |*      |The value to check                |
 |return|boolean|True if value is an `Array` object|

 ```javascript
 isArr([]); // -> true
 isArr({}); // -> false
 ```

## isBool 

Check if value is a boolean primitive.

 |Name  |Type   |Desc                      |
 |------|-------|--------------------------|
 |val   |*      |The value to check        |
 |return|boolean|True if value is a boolean|

 ```javascript
 isBool(true); // -> true
 isBool(false); // -> true
 isBool(1); // -> false
 ```

## startWith 

Check if string starts with the given target string.

 |Name  |Type   |Desc                             |
 |------|-------|---------------------------------|
 |str   |string |The string to search             |
 |prefix|string |String prefix                    |
 |return|boolean|True if string starts with prefix|

 ```javascript
 startWith('ab', 'a'); // -> true
 ```

## isCrossOrig 

No documentation.

## isEl 

Check if value is a DOM element.

 |Name  |Type   |Desc                          |
 |------|-------|------------------------------|
 |val   |*      |Value to check                |
 |return|boolean|True if value is a DOM element|

 ```javascript
 isEl(document.body); // -> true
 ```

## isEmpty 

Check if value is an empty object or array.

 |Name  |Type   |Desc                  |
 |------|-------|----------------------|
 |val   |*      |Value to check        |
 |return|boolean|True if value is empty|

 ```javascript
 isEmpty([]); // -> true
 isEmpty({}); // -> true
 ```

## isErr 

Check if value is an error.

 |Name  |Type   |Desc                     |
 |------|-------|-------------------------|
 |val   |*      |The value to check       |
 |return|boolean|True if value is an error|

 ```javascript
 isErr(new Error()); // -> true
 ```

## isErudaEl 

No documentation.

## isFn 

Check if value is a function.

 |Name  |Type   |Desc                       |
 |------|-------|---------------------------|
 |val   |*      |The value to check         |
 |return|boolean|True if value is a function|

 Generator function is also classified as true.

 ```javascript
 isFn(function() {}); // -> true
 isFn(function*() {}); // -> true
 ```

## isMatch 

Check if keys and values in src are contained in obj.

 |Name  |Type   |Desc                              |
 |------|-------|----------------------------------|
 |obj   |object |Object to inspect                 |
 |src   |object |Object of property values to match|
 |return|boolean|True if object is match           |

 ```javascript
 isMatch({a: 1, b: 2}, {a: 1}); // -> true
 ```

## isRegExp 

Check if value is a regular expression.

 |Name  |Type   |Desc                                 |
 |------|-------|-------------------------------------|
 |val   |*      |The value to check                   |
 |return|boolean|True if value is a regular expression|

 ```javascript
 isRegExp(/a/); // -> true
 ```

## loadJs 

Inject script tag into page with given src value.

## ltrim 

Remove chars or white-spaces from beginning of string.

 |Name  |Type         |Desc                  |
 |------|-------------|----------------------|
 |str   |string       |The string to trim    |
 |chars |string\|array|The characters to trim|
 |return|string       |The trimmed string    |

 ```javascript
 ltrim(' abc  '); // -> 'abc  '
 ltrim('_abc_', '_'); // -> 'abc_'
 ltrim('_abc_', ['a', '_']); // -> 'bc_'
 ```

## matcher 

No documentation.

## noop 

A no-operation function.

## now 

Gets the number of milliseconds that have elapsed since the Unix epoch.

## optimizeCb 

No documentation.

## safeCb 

function
 safeCb: Create callback based on input value.

## filter 

Iterates over elements of collection, returning an array of all the values that pass a truth test.

 |Name     |Type    |Desc                                   |
 |---------|--------|---------------------------------------|
 |obj      |array   |Collection to iterate over             |
 |predicate|function|Function invoked per iteration         |
 |[ctx]    |*       |Predicate context                      |
 |return   |array   |Array of all values that pass predicate|

 ```javascript
 filter([1, 2, 3, 4, 5], function (val)
 {
     return val % 2 === 0;
 }); // -> [2, 4]
 ```

## map 

Create an array of values by running each element in collection through iteratee.

 |Name    |Type         |Desc                          |
 |--------|-------------|------------------------------|
 |obj     |array\|object|Collection to iterate over    |
 |iteratee|function     |Function invoked per iteration|
 |[ctx]   |*            |Function context              |
 |return  |array        |New mapped array              |

 ```javascript
 map([4, 8], function (n) { return n * n; }); // -> [16, 64]
 ```

## toArr 

Convert value to an array.

 |Name  |Type |Desc            |
 |------|-----|----------------|
 |val   |*    |Value to convert|
 |return|array|Converted array |

 ```javascript
 toArr({a: 1, b: 2}); // -> [{a: 1, b: 2}]
 toArr('abc'); // -> ['abc']
 toArr(1); // -> []
 toArr(null); // -> []
 ```

## Class 

Create JavaScript class.

 |Name   |Type    |Desc                             |
 |-------|--------|---------------------------------|
 |methods|object  |Public methods                   |
 |statics|object  |Static methods                   |
 |return |function|Function used to create instances|

 ```javascript
 var People = Class({
     initialize: function (name, age)
     {
         this.name = name;
         this.age = age;
     },
     introduce: function ()
     {
         return 'I am ' + this.name + ', ' + this.age + ' years old.'.
     }
 });

 var Student = People.extend({
     initialize: function (name, age, school)
     {
         this.callSuper('initialize', name, age);

         this.school = school.
     },
     introduce: function ()
     {
         return this.callSuper('introduce') + '\n I study at ' + this.school + '.'.
     }
 }, {
     is: function (obj)
     {
         return obj instanceof Student;
    }
 });

 var a = new Student('allen', 17, 'Hogwarts');
 a.introduce(); // -> 'I am allen, 17 years old. \n I study at Hogwarts.'
 Student.is(a); // -> true
 ```

## Emitter 

No documentation.

## Select 

jQuery like dom manipulator.

## $safeNodes 

No documentation.

## $attr 

No documentation.

## $data 

No documentation.

## $css 

No documentation.

## $insert 

No documentation.

## $offset 

No documentation.

## $property 

No documentation.

## $remove 

No documentation.

## $show 

No documentation.

## delegate 

No documentation.

## $event 

No documentation.

## some 

Check if predicate return truthy for any element.

 |Name     |Type         |Desc                                          |
 |---------|-------------|----------------------------------------------|
 |obj      |array\|object|Collection to iterate over                    |
 |predicate|function     |Function to invoked per iteration             |
 |ctx      |*            |Predicate context                             |
 |return   |boolean      |True if any element passes the predicate check|

 ```javascript
 some([2, 5], function (val)
 {
     return val % 2 === 0;
 }); // -> true
 ```

## $class 

No documentation.

## $ 

jQuery like style dom manipulator.

## orientation 

No documentation.

## toNum 

Convert value to a number.

 |Name  |Type  |Desc            |
 |------|------|----------------|
 |val   |*     |Value to process|
 |return|number|Resulted number |

 ```javascript
 toNum('5'); // -> 5
 ```

## pxToNum 

No documentation.

## rtrim 

Remove chars or white-spaces from end of string.

 |Name  |Type         |Desc                  |
 |------|-------------|----------------------|
 |str   |string       |The string to trim    |
 |chars |string\|array|The characters to trim|
 |return|string       |The trimmed string    |

 ```javascript
 rtrim(' abc  '); // -> ' abc'
 rtrim('_abc_', '_'); // -> '_abc'
 rtrim('_abc_', ['c', '_']); // -> '_ab'
 ```

## trim 

Remove chars or white-spaces from beginning end of string.

 |Name  |Type         |Desc                  |
 |------|-------------|----------------------|
 |str   |string       |The string to trim    |
 |chars |string\|array|The characters to trim|
 |return|string       |The trimmed string    |

 ```javascript
 trim(' abc  '); // -> 'abc'
 trim('_abc_', '_'); // -> 'abc'
 trim('_abc_', ['a', 'c', '_']); // -> 'b'
 ```

## getFileName 

No documentation.

## toStr 

Convert value to a string.

 |Name  |Type  |Desc            |
 |------|------|----------------|
 |val   |*     |Value to convert|
 |return|string|Resulted string |

 ```javascript
 toStr(null); // -> ''
 toStr(1); // -> '1'
 toStr(false); // -> 'false'
 toStr([1, 2, 3]); // -> '1,2,3'
 ```

## uniqId 

Generate a globally-unique id.

 |Name  |Type  |Desc              |
 |------|------|------------------|
 |prefix|string|Id prefix         |
 |return|string|Globally-unique id|

 ```javascript
 uniqueId('eusita_'); // -> 'eustia_xxx'
 ```

## unique 

Create duplicate-free version of an array.

 |Name     |Type    |Desc                         |
 |---------|--------|-----------------------------|
 |arr      |array   |Array to inspect             |
 |[compare]|function|Function for comparing values|
 |return   |array   |New duplicate free array     |

 ```javascript
 unique([1, 2, 3, 1]); // -> [1, 2, 3]
 ```

## upperFirst 

Convert the first character of string to upper case.

 |Name  |Type  |Desc             |
 |------|------|-----------------|
 |str   |string|String to convert|
 |return|string|Converted string |

 ```javascript
 upperFirst('red'); // -> RED
 ```
