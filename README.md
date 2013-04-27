# Underscore.transparent [![Build Status](https://secure.travis-ci.org/nowhereman/underscore.transparent.png?branch=master)](http://travis-ci.org/nowhereman/underscore.transparent) #

> No one wants to dream about `_`, most people prefer `$`.
> -- <cite>(c) 2013 André Deudant</cite>

If you're too lazy to read and write `_` character.
Underscore.transparent is for you!

Old and boring `_.` syntax:
```javascript
_.each(['zero', 'one', 'two'], function(element, index) { console.log(index+':'+element); });
=> "0:zero"
"1:one"
"2:two"

_.chain([2, 1, 3, [5, 8, 3, 9], null, false]).flatten().compact().uniq().shuffle().sort().value();
=> [1, 2, 3, 5, 8, 9]

_("   epeli  ").trim().capitalize();
=> "Epeli"
```

Becomes syntactic sugar:
```javascript
['zero', 'one', 'two'].each(function(element, index) { console.log(index+':'+element); });
=> "0:zero"
"1:one"
"2:two"

[2, 1, 3, [5, 8, 3, 9], null, false].flatten().compact().uniq().shuffle().sort();
=> [1, 2, 3, 5, 8, 9]

"   epeli  ".trim().capitalize();
=> "Epeli"
```

> [Underscore.js][u] is a utility-belt library for JavaScript that provides a lot of the functional programming support that you would expect in Prototype.js (or Ruby), <del>but without extending any of the built-in JavaScript objects</del>.

Underscore.transparent.js **extends** the built-in JavaScript objects with Underscore (and [Underscore.string.js][u.s]).
So you can use Object-Oriented style and chaining with all Underscore and Underscore.string functions, without using the `_` character (in the same way as [Sugar][s] library).

But modifying native objects... isn't it evil?
  * Quick answer: **No!**
  * For a longer answer read this excellent [post][s.n].

[u]: http://underscorejs.org/
[u.s]: http://epeli.github.io/underscore.string/
[s]: http://sugarjs.com/
[s.n]: http://sugarjs.com/native
[n]: http://nodejs.org/
[npm]: https://npmjs.org/
[p]: http://phantomjs.org/


## Download ##

  * [Development version](https://raw.github.com/nowhereman/underscore.transparent/master/lib/underscore.transparent.js) *Uncompressed with Comments 14kb*
  * [Production version](https://github.com/nowhereman/underscore.transparent/raw/master/dist/underscore.transparent.min.js) *Minified and Gzipped 1.9kb*

## Installation and usage ##

### In browsers ###

```html
<script type="text/javascript" language="javascript" charset="utf-8" src="http://underscorejs.org/underscore-min.js"></script>

<!-- Optional Underscore.string integration -->
  <script type="text/javascript" language="javascript" charset="utf-8" src="https://raw.github.com/epeli/underscore.string/master/dist/underscore.string.min.js"></script>

<script type="text/javascript" language="javascript" charset="utf-8" src="https://raw.github.com/nowhereman/underscore.transparent/master/dist/underscore.transparent.min.js"></script>

<script type="text/javascript" language="javascript" charset="utf-8">
// <![CDATA[
  //Alias Underscore conflict functions
  _.mixin({
    encode: _.escape,
    decode: _.unescape,
    isNaNumber: _.isNaN
  });
  
  //Optional Underscore.string initialization
    _.mixin(_(_.str.exports()).extend({
      //Alias Underscore.string functions
      includeString: _.str.include,
      containsString: _.str.contains,
      reverseString: _.str.reverse,
    }));
  // End of Optional
  
  //Init Underscore.transparent
  _.transparent();
// ]]>
</script>
```

### [bower](https://github.com/twitter/bower) installation ###

    bower install underscore.transparent

Or add `underscore.transparent` to your apps `component.json`.
``` json
  "dependencies": {
    "underscore.transparent": "latest"
  }
```

### [Node.js][n] installation ###

**[npm][npm] package**

    npm install underscore.transparent

**Integrate with Underscore.js**:
```javascript
root._ = require('underscore');
//Alias Underscore conflict functions
_.mixin({
  encode: _.escape,
  decode: _.unescape,
  isNaNumber: _.isNaN
});
```

***Optional Underscore.string integration***:
```javascript
  // Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
  _.str = require('underscore.string');
  // Mix in non-conflict functions and aliasing conflict functions to Underscore namespace, more info at https://github.com/epeli/underscore.string#readme
  _.mixin(_(_.str.exports()).extend({
    includeString: _.str.include,
    containsString: _.str.contains,
    reverseString: _.str.reverse
  }));
```

**Last but not least, init Underscore.transparent**:
```javascript
require('underscore.transparent');
_.transparent();
```

OMG `_` is now transparent !


## Caveats ##

Underscore conflict functions with `window` global object:
  * `window.escape`: Underscore.js doesn't have the same behaviour.
     You must use `window.encode` alias or `Object.escape`.
  * `window.unescape`: Underscore.js doesn't have the same behaviour.
     You must use `window.decode` alias  or `Object.unescape`.
  * `window.isNaN`: Underscore.js doesn't have the same behaviour. `isNaN(undefined) => true` `_.isNaN(undefined) => false`.
     You must use `window.isNaNumber` alias or `Object.isNaN`.

Legacy browsers like IE 8 and below don't support correctly `defineProperty` function.
For more info, read the last paragraph of [this post][s.n].
To prevent bugs in these browsers, Underscore.transparent don't add properties to `Object.prototype` by default.

You need to cast your objets to `Hash` class via `Object.toHash` or `window.toHash` or `toHash` function:
```javascript
var obj1 = toHash({1:'one', 2:'two', 3:'three'});
obj1.each(function(element, index) { console.log(index+':'+element); })
=> "1:one"
"2:two"
"3:three"
```

Of course you can alias the `toHash` function with a shorter name:
```javascript
var h = toHash; // alias of toHash function

var obj1 = h({1:'one', 2:'two', 3:'three'});
obj1.each(function(element, index) { console.log(index+':'+element); })
=> "1:one"
"2:two"
"3:three"
```

Inline `Integer` and `Function` calls need parenthesis:
```javascript
(2).times(function(i) { console.log(i + ' times'); });

(function() { console.log("delayed during 1 sec."); }).delay(1000);
```

But generally, in real application code, you do:
```javascript
var n = 2;
//...{some code}...
n.times(function(i) { console.log(i + ' times'); });

var myDelayedFunction = function() { console.log("delayed during 1 sec."); };
//...{some code}...
myDelayedFunction.delay(1000);
```

Due to JavaScript limitations, we lose some things:
* Functions aren't available for `undefined` and `null` properties, <del>`null.values()`</del> trigger: `"TypeError: null has no properties 'null.values()'"`
  You need to use `Object.values(null)`.
* Calls like `var s1 = "foobar"; s1.isString()` aren't available to prevent unexpected bugs when the `s1` variable is `null`, `undefined` or with `isObject` function.
  Instead, you should do `Object.isString("foobar")` or `window.isString("foobar")` (or `isString("foobar")`)
* Native chaining don't work correctly for JavaScript functions who don't return the current object (E.g. `Array.prototype.[push|pop|shift|unshift]`). <del>`[2,1,3].shuffle().pop().sort(); => []`</del> trigger `"TypeError: (intermediate value).shuffle(...).pop(...).sort is not a function"`.
 
  In this case, you need to use `chain` and `value` functions: `[2,1,3].chain().shuffle().pop().sort().value(); => [1,2]`


## More transparent functions ##

If you're application doesn't need to support IE 8 and below you can extend all `Hash` functions into `Object`.
```javascript
_.transparent({extendAll: true});
```

So you can use Objects `Underscore` functions without `toHash` cast function:
```javascript
var obj1 = {1:'one', 2:'two', 3:'three'};
obj1.each(function(element, index) { console.log(index+':'+element); })
=> "1:one"
"2:two"
"3:three"
```

Otherwise `Object` functions from examples will be available through `Object.myFunction`:
```javascript
var obj1 = {1:'one', 2:'two', 3:'three'};
Object.each(obj1, function(element, index) { console.log(index+':'+element); })
=> "1:one"
"2:two"
"3:three"
```


## Roadmap ##

Any suggestions or bug reports are welcome. Just open an issue.


## Changelog ##

### 0.4.2 ###

* First public release !


## Contribute ##

* Fork & pull request. Don't forget about tests.
* If you planning add some feature please create issue before.

Otherwise changes will be rejected.


## Running tests ##

Open `test/index.html` file in your Web browser.

Without a Web browser, install [PhantomJS][p] and [NPM][npm], then:
```sh
npm test
```


## Contributors list ##
[Can be found here](https://github.com/nowhereman/underscore.transparent/graphs/contributors).


## Licence ##

The MIT License

Copyright (c) 2013 Nowhere Man

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

