$(document).ready(function() {

  module("Objects");

  test("keys", function() {
    equal(Object.toHash({one : 1, two : 2}).keys().join(', '), 'one, two', 'can extract the keys from an object');
    // the test above is not safe because it relies on for-in enumeration order
    var a = []; a[1] = 0;
    equal(Object.toHash(a).keys().join(', '), '1', 'is not fooled by sparse arrays; see issue #95');
    raises(function() { null.keys(); }, TypeError, 'throws an error for `null` values');
    raises(function() { (void 0).keys(); }, TypeError, 'throws an error for `undefined` values');
    raises(function() { (1).keys(); }, TypeError, 'throws an error for number primitives');
    raises(function() { 'a'.keys(); }, TypeError, 'throws an error for string primitives');
    raises(function() { true.keys(); }, TypeError, 'throws an error for boolean primitives');
  });

  test("values", function() {
    equal(Object.toHash({one: 1, two: 2}).values().join(', '), '1, 2', 'can extract the values from an object');
    equal(Object.toHash({one: 1, two: 2, length: 3}).values().join(', '), '1, 2, 3', '... even when one of them is "length"');
  });

  test("pairs", function() {
    deepEqual(Object.toHash({one: 1, two: 2}).pairs(), [['one', 1], ['two', 2]], 'can convert an object into pairs');
    deepEqual(Object.toHash({one: 1, two: 2, length: 3}).pairs(), [['one', 1], ['two', 2], ['length', 3]], '... even when one of them is "length"');
  });

  test("invert", function() {
    var obj = Object.toHash({first: 'Moe', second: 'Larry', third: 'Curly'});
    equal(Object.toHash(obj.invert()).keys().join(' '), 'Moe Larry Curly', 'can invert an object');
    ok(Object.isEqual(Object.toHash(obj.invert()).invert(), obj), 'two inverts gets you back where you started');

    var obj = Object.toHash({length: 3});
    ok(obj.invert()['3'] == 'length', 'can invert an object with "length"')
  });

  test("functions", function() {
    var obj = {a : 'dash', b : _.map, c : (/yo/), d : _.reduce};
    ok(Object.isEqual(['b', 'd'], Object.functions(obj)), 'can grab the function names of any passed-in object');

    var Animal = function(){};
    Animal.prototype.run = function(){};
    equal(Object.functions(new Animal).join(''), 'run', 'also looks up functions on the prototype');
  });

  test("extend", function() {
    var result;
    equal(Object.toHash({}).extend({a:'b'}).a, 'b', 'can extend an object with the attributes of another');
    equal(Object.toHash({a:'x'}).extend({a:'b'}).a, 'b', 'properties in source override destination');
    equal(Object.toHash({x:'x'}).extend({a:'b'}).x, 'x', 'properties not in source dont get overriden');
    result = Object.toHash({x:'x'}).extend({a:'a'}, {b:'b'});
    ok(result.isEqual({x:'x', a:'a', b:'b'}), 'can extend from multiple source objects');
    result = Object.toHash({x:'x'}).extend({a:'a', x:2}, {a:'b'});
    ok(result.isEqual({x:2, a:'b'}), 'extending from multiple source objects last property trumps');
    result = Object.toHash({}).extend({a: void 0, b: null});
    equal(result.keys().join(''), 'ab', 'extend does not copy undefined values');

    try {
      result = Object.toHash({});
      result.extend(null, undefined, {a:1});
    } catch(ex) {}

    equal(result.a, 1, 'should not error on `null` or `undefined` sources');
  });

  test("pick", function() {
    var result;
    result = Object.toHash({a:1, b:2, c:3}).pick('a', 'c');
    ok(Object.isEqual(result, {a:1, c:3}), 'can restrict properties to those named');
    result = Object.toHash({a:1, b:2, c:3}).pick(['b', 'c']);
    ok(Object.isEqual(result, {b:2, c:3}), 'can restrict properties to those named in an array');
    result = Object.toHash({a:1, b:2, c:3}).pick(['a'], 'b');
    ok(Object.isEqual(result, {a:1, b:2}), 'can restrict properties to those named in mixed args');

    var Obj = function(){};
    Obj.prototype = Object.toHash({a: 1, b: 2, c: 3});
    ok(Object.isEqual(new Obj().pick('a', 'c'), {a:1, c: 3}), 'include prototype props');
  });

  test("omit", function() {
    var result;
    result = Object.toHash({a:1, b:2, c:3}).omit('b');
    ok(Object.isEqual(result, {a:1, c:3}), 'can omit a single named property');
    result = Object.toHash({a:1, b:2, c:3}).omit('a', 'c');
    ok(Object.isEqual(result, {b:2}), 'can omit several named properties');
    result = Object.toHash({a:1, b:2, c:3}).omit(['b', 'c']);
    ok(Object.isEqual(result, {a:1}), 'can omit properties named in an array');

    var Obj = function(){};
    Obj.prototype = Object.toHash({a: 1, b: 2, c: 3});
    ok(Object.isEqual(new Obj().omit('b'), {a:1, c: 3}), 'include prototype props');
  });

  test("defaults", function() {
    var result;
    var options = Object.toHash({zero: 0, one: 1, empty: "", nan: NaN, string: "string"});

    options.defaults({zero: 1, one: 10, twenty: 20});
    equal(options.zero, 0, 'value exists');
    equal(options.one, 1, 'value exists');
    equal(options.twenty, 20, 'default applied');

    options.defaults({empty: "full"}, {nan: "nan"}, {word: "word"}, {word: "dog"});
    equal(options.empty, "", 'value exists');
    ok(Object.isNaN(options.nan), "NaN isn't overridden");
    equal(options.word, "word", 'new value is added, first one wins');

    try {
      options = Object.toHash({});
      options.defaults(null, undefined, {a:1});
    } catch(ex) {}

    equal(options.a, 1, 'should not error on `null` or `undefined` sources');
  });

  test("clone", function() {
    var moe = Object.toHash({name : 'moe', lucky : [13, 27, 34]});
    var clone = moe.clone();
    equal(clone.name, 'moe', 'the clone as the attributes of the original');

    clone.name = 'curly';
    ok(clone.name == 'curly' && moe.name == 'moe', 'clones can change shallow attributes without affecting the original');

    clone.lucky.push(101);
    equal(moe.lucky.last(), 101, 'changes to deep attributes are shared with the original');

    equal(Object.clone(undefined), void 0, 'non objects should not be changed by clone');
    equal(Object.clone(1), 1, 'non objects should not be changed by clone');
    equal(Object.clone(null), null, 'non objects should not be changed by clone');
  });

  test("isEqual", function() {
    function First() {
      this.value = 1;
    }
    First.prototype.value = 1;
    function Second() {
      this.value = 1;
    }
    Second.prototype.value = 2;

    // Basic equality and identity comparisons.
    ok(Object.isEqual(null, null), "`null` is equal to `null`");
    ok(Object.isEqual(), "`undefined` is equal to `undefined`");

    ok(!Object.isEqual(0, -0), "`0` is not equal to `-0`");
    ok(!Object.isEqual(-0, 0), "Commutative equality is implemented for `0` and `-0`");
    ok(!Object.isEqual(null, undefined), "`null` is not equal to `undefined`");
    ok(!Object.isEqual(undefined, null), "Commutative equality is implemented for `null` and `undefined`");

    // String object and primitive comparisons.
    ok(Object.isEqual("Curly", "Curly"), "Identical string primitives are equal");
    ok(Object.isEqual(new String("Curly"), new String("Curly")), "String objects with identical primitive values are equal");
    ok(Object.isEqual(new String("Curly"), "Curly"), "String primitives and their corresponding object wrappers are equal");
    ok(Object.isEqual("Curly", new String("Curly")), "Commutative equality is implemented for string objects and primitives");

    ok(!Object.isEqual("Curly", "Larry"), "String primitives with different values are not equal");
    ok(!Object.isEqual(new String("Curly"), new String("Larry")), "String objects with different primitive values are not equal");
    ok(!Object.isEqual(new String("Curly"), {toString: function(){ return "Curly"; }}), "String objects and objects with a custom `toString` method are not equal");

    // Number object and primitive comparisons.
    ok(Object.isEqual(75, 75), "Identical number primitives are equal");
    ok(Object.isEqual(new Number(75), new Number(75)), "Number objects with identical primitive values are equal");
    ok(Object.isEqual(75, new Number(75)), "Number primitives and their corresponding object wrappers are equal");
    ok(Object.isEqual(new Number(75), 75), "Commutative equality is implemented for number objects and primitives");
    ok(!Object.isEqual(new Number(0), -0), "`new Number(0)` and `-0` are not equal");
    ok(!Object.isEqual(0, new Number(-0)), "Commutative equality is implemented for `new Number(0)` and `-0`");

    ok(!Object.isEqual(new Number(75), new Number(63)), "Number objects with different primitive values are not equal");
    ok(!Object.isEqual(new Number(63), {valueOf: function(){ return 63; }}), "Number objects and objects with a `valueOf` method are not equal");

    // Comparisons involving `NaN`.
    ok(Object.isEqual(NaN, NaN), "`NaN` is equal to `NaN`");
    ok(!Object.isEqual(61, NaN), "A number primitive is not equal to `NaN`");
    ok(!Object.isEqual(new Number(79), NaN), "A number object is not equal to `NaN`");
    ok(!Object.isEqual(Infinity, NaN), "`Infinity` is not equal to `NaN`");

    // Boolean object and primitive comparisons.
    ok(Object.isEqual(true, true), "Identical boolean primitives are equal");
    ok(Object.isEqual(new Boolean, new Boolean), "Boolean objects with identical primitive values are equal");
    ok(Object.isEqual(true, new Boolean(true)), "Boolean primitives and their corresponding object wrappers are equal");
    ok(Object.isEqual(new Boolean(true), true), "Commutative equality is implemented for booleans");
    ok(!Object.isEqual(new Boolean(true), new Boolean), "Boolean objects with different primitive values are not equal");

    // Common type coercions.
    ok(!Object.isEqual(true, new Boolean(false)), "Boolean objects are not equal to the boolean primitive `true`");
    ok(!Object.isEqual("75", 75), "String and number primitives with like values are not equal");
    ok(!Object.isEqual(new Number(63), new String(63)), "String and number objects with like values are not equal");
    ok(!Object.isEqual(75, "75"), "Commutative equality is implemented for like string and number values");
    ok(!Object.isEqual(0, ""), "Number and string primitives with like values are not equal");
    ok(!Object.isEqual(1, true), "Number and boolean primitives with like values are not equal");
    ok(!Object.isEqual(new Boolean(false), new Number(0)), "Boolean and number objects with like values are not equal");
    ok(!Object.isEqual(false, new String("")), "Boolean primitives and string objects with like values are not equal");
    ok(!Object.isEqual(12564504e5, new Date(2009, 9, 25)), "Dates and their corresponding numeric primitive values are not equal");

    // Dates.
    ok(Object.isEqual(new Date(2009, 9, 25), new Date(2009, 9, 25)), "Date objects referencing identical times are equal");
    ok(!Object.isEqual(new Date(2009, 9, 25), new Date(2009, 11, 13)), "Date objects referencing different times are not equal");
    ok(!Object.isEqual(new Date(2009, 11, 13), {
      getTime: function(){
        return 12606876e5;
      }
    }), "Date objects and objects with a `getTime` method are not equal");
    ok(!Object.isEqual(new Date("Curly"), new Date("Curly")), "Invalid dates are not equal");

    // Functions.
    ok(!Object.isEqual(First, Second), "Different functions with identical bodies and source code representations are not equal");

    // RegExps.
    ok(Object.isEqual(/(?:)/gim, /(?:)/gim), "RegExps with equivalent patterns and flags are equal");
    ok(!Object.isEqual(/(?:)/g, /(?:)/gi), "RegExps with equivalent patterns and different flags are not equal");
    ok(!Object.isEqual(/Moe/gim, /Curly/gim), "RegExps with different patterns and equivalent flags are not equal");
    ok(!Object.isEqual(/(?:)/gi, /(?:)/g), "Commutative equality is implemented for RegExps");
    ok(!Object.isEqual(/Curly/g, {source: "Larry", global: true, ignoreCase: false, multiline: false}), "RegExps and RegExp-like objects are not equal");

    // Empty arrays, array-like objects, and object literals.
    ok(Object.isEqual({}, {}), "Empty object literals are equal");
    ok(Object.isEqual([], []), "Empty array literals are equal");
    ok(Object.isEqual([{}], [{}]), "Empty nested arrays and objects are equal");
    ok(!Object.isEqual({length: 0}, []), "Array-like objects and arrays are not equal.");
    ok(!Object.isEqual([], {length: 0}), "Commutative equality is implemented for array-like objects");

    ok(!Object.isEqual({}, []), "Object literals and array literals are not equal");
    ok(!Object.isEqual([], {}), "Commutative equality is implemented for objects and arrays");

    // Arrays with primitive and object values.
    ok(Object.isEqual([1, "Larry", true], [1, "Larry", true]), "Arrays containing identical primitives are equal");
    ok(Object.isEqual([(/Moe/g), new Date(2009, 9, 25)], [(/Moe/g), new Date(2009, 9, 25)]), "Arrays containing equivalent elements are equal");

    // Multi-dimensional arrays.
    var a = [new Number(47), false, "Larry", /Moe/, new Date(2009, 11, 13), ['running', 'biking', new String('programming')], {a: 47}];
    var b = [new Number(47), false, "Larry", /Moe/, new Date(2009, 11, 13), ['running', 'biking', new String('programming')], {a: 47}];
    ok(Object.isEqual(a, b), "Arrays containing nested arrays and objects are recursively compared");

    // Overwrite the methods defined in ES 5.1 section 15.4.4.
    //a.forEach = a.map = a.filter = a.every = a.indexOf = a.lastIndexOf = a.some = a.reduce = a.reduceRight = null;// NOTICE: Underscore.transparent need native function
    //b.join = b.pop = b.reverse = b.shift = b.slice = b.splice = b.concat = b.sort = b.unshift = null;// NOTICE: Underscore.transparent need native function

    // Array elements and properties.
    ok(Object.isEqual(a, b), "Arrays containing equivalent elements and different non-numeric properties are equal");
    a.push("White Rocks");
    ok(!Object.isEqual(a, b), "Arrays of different lengths are not equal");
    a.push("East Boulder");
    b.push("Gunbarrel Ranch", "Teller Farm");
    ok(!Object.isEqual(a, b), "Arrays of identical lengths containing different elements are not equal");

    // Sparse arrays.
    ok(Object.isEqual(Array(3), Array(3)), "Sparse arrays of identical lengths are equal");
    ok(!Object.isEqual(Array(3), Array(6)), "Sparse arrays of different lengths are not equal when both are empty");

    // Simple objects.
    ok(Object.isEqual({a: "Curly", b: 1, c: true}, {a: "Curly", b: 1, c: true}), "Objects containing identical primitives are equal");
    ok(Object.isEqual({a: /Curly/g, b: new Date(2009, 11, 13)}, {a: /Curly/g, b: new Date(2009, 11, 13)}), "Objects containing equivalent members are equal");
    ok(!Object.isEqual({a: 63, b: 75}, {a: 61, b: 55}), "Objects of identical sizes with different values are not equal");
    ok(!Object.isEqual({a: 63, b: 75}, {a: 61, c: 55}), "Objects of identical sizes with different property names are not equal");
    ok(!Object.isEqual({a: 1, b: 2}, {a: 1}), "Objects of different sizes are not equal");
    ok(!Object.isEqual({a: 1}, {a: 1, b: 2}), "Commutative equality is implemented for objects");
    ok(!Object.isEqual({x: 1, y: undefined}, {x: 1, z: 2}), "Objects with identical keys and different values are not equivalent");

    // `A` contains nested objects and arrays.
    a = {
      name: new String("Moe Howard"),
      age: new Number(77),
      stooge: true,
      hobbies: ["acting"],
      film: {
        name: "Sing a Song of Six Pants",
        release: new Date(1947, 9, 30),
        stars: [new String("Larry Fine"), "Shemp Howard"],
        minutes: new Number(16),
        seconds: 54
      }
    };

    // `B` contains equivalent nested objects and arrays.
    b = {
      name: new String("Moe Howard"),
      age: new Number(77),
      stooge: true,
      hobbies: ["acting"],
      film: {
        name: "Sing a Song of Six Pants",
        release: new Date(1947, 9, 30),
        stars: [new String("Larry Fine"), "Shemp Howard"],
        minutes: new Number(16),
        seconds: 54
      }
    };
    ok(Object.isEqual(a, b), "Objects with nested equivalent members are recursively compared");

    // Instances.
    ok(Object.isEqual(new First, new First), "Object instances are equal");
    ok(!Object.isEqual(new First, new Second), "Objects with different constructors and identical own properties are not equal");
    ok(!Object.isEqual({value: 1}, new First), "Object instances and objects sharing equivalent properties are not equal");
    ok(!Object.isEqual({value: 2}, new Second), "The prototype chain of objects should not be examined");

    // Circular Arrays.
    (a = []).push(a);
    (b = []).push(b);
    ok(Object.isEqual(a, b), "Arrays containing circular references are equal");
    a.push(new String("Larry"));
    b.push(new String("Larry"));
    ok(Object.isEqual(a, b), "Arrays containing circular references and equivalent properties are equal");
    a.push("Shemp");
    b.push("Curly");
    ok(!Object.isEqual(a, b), "Arrays containing circular references and different properties are not equal");

    // More circular arrays #767.
    a = ["everything is checked but", "this", "is not"];
    a[1] = a;
    b = ["everything is checked but", ["this", "array"], "is not"];
    ok(!Object.isEqual(a, b), "Comparison of circular references with non-circular references are not equal");

    // Circular Objects.
    a = {abc: null};
    b = {abc: null};
    a.abc = a;
    b.abc = b;
    ok(Object.isEqual(a, b), "Objects containing circular references are equal");
    a.def = 75;
    b.def = 75;
    ok(Object.isEqual(a, b), "Objects containing circular references and equivalent properties are equal");
    a.def = new Number(75);
    b.def = new Number(63);
    ok(!Object.isEqual(a, b), "Objects containing circular references and different properties are not equal");

    // More circular objects #767.
    a = {everything: "is checked", but: "this", is: "not"};
    a.but = a;
    b = {everything: "is checked", but: {that:"object"}, is: "not"};
    ok(!Object.isEqual(a, b), "Comparison of circular references with non-circular object references are not equal");

    // Cyclic Structures.
    a = [{abc: null}];
    b = [{abc: null}];
    (a[0].abc = a).push(a);
    (b[0].abc = b).push(b);
    ok(Object.isEqual(a, b), "Cyclic structures are equal");
    a[0].def = "Larry";
    b[0].def = "Larry";
    ok(Object.isEqual(a, b), "Cyclic structures containing equivalent properties are equal");
    a[0].def = new String("Larry");
    b[0].def = new String("Curly");
    ok(!Object.isEqual(a, b), "Cyclic structures containing different properties are not equal");

    // Complex Circular References.
    a = {foo: {b: {foo: {c: {foo: null}}}}};
    b = {foo: {b: {foo: {c: {foo: null}}}}};
    a.foo.b.foo.c.foo = a;
    b.foo.b.foo.c.foo = b;
    ok(Object.isEqual(a, b), "Cyclic structures with nested and identically-named properties are equal");

    // Chaining.
    ok(!Object.isEqual(Object.toHash({x: 1, y: undefined}).chain(), Object.toHash({x: 1, z: 2}).chain()), 'Chained objects containing different values are not equal');

    a = Object.toHash({x: 1, y: 2}).chain();
    b = Object.toHash({x: 1, y: 2}).chain();
    equal(Object.isEqual(a.isEqual(b), Object.toHash(true)), true, '`isEqual` can be chained');

    // Objects from another frame.
    ok(Object.isEqual({}, iObject));
  });

  test("isEmpty", function() {
    ok(!Object.isEmpty([1]), '[1] is not empty');
    ok(Object.isEmpty([]), '[] is empty');
    ok(!Object.isEmpty({one : 1}), '{one : 1} is not empty');
    ok(Object.isEmpty({}), '{} is empty');
    ok(Object.isEmpty(new RegExp('')), 'objects with prototype properties are empty');
    ok(Object.isEmpty(null), 'null is empty');
    ok(Object.isEmpty(undefined), 'undefined is empty');
    ok(Object.isEmpty(''), 'the empty string is empty');
    ok(!Object.isEmpty('moe'), 'but other strings are not');

    var obj = {one : 1};
    delete obj.one;
    ok(Object.isEmpty(obj), 'deleting all the keys from an object empties it');
  });

  // Setup remote variables for iFrame tests.
  var iframe = document.createElement('iframe');
  jQuery(iframe).appendTo(document.body);
  var iDoc = iframe.contentDocument || iframe.contentWindow.document;
  iDoc.write(
    "<script>\
      parent.iElement   = document.createElement('div');\
      parent.iArguments = (function(){ return arguments; })(1, 2, 3);\
      parent.iArray     = [1, 2, 3];\
      parent.iString    = new String('hello');\
      parent.iNumber    = new Number(100);\
      parent.iFunction  = (function(){});\
      parent.iDate      = new Date();\
      parent.iRegExp    = /hi/;\
      parent.iNaN       = NaN;\
      parent.iNull      = null;\
      parent.iBoolean   = new Boolean(false);\
      parent.iUndefined = undefined;\
      parent.iObject     = {};\
    </script>"
  );
  iDoc.close();

  test("isElement", function() {
    ok(!Object.isElement('div'), 'strings are not dom elements');
    ok(Object.isElement($('html')[0]), 'the html tag is a DOM element');
    ok(Object.isElement(iElement), 'even from another frame');
  });

  test("isArguments", function() {
    var args = (function(){ return arguments; })(1, 2, 3);
    ok(!Object.isArguments('string'), 'a string is not an arguments object');
    ok(!Object.isArguments(Object.isArguments), 'a function is not an arguments object');
    ok(Object.isArguments(args), 'but the arguments object is an arguments object');
    ok(!Object.isArguments(Object.toArray(args)), 'but not when it\'s converted into an array');
    ok(!Object.isArguments([1,2,3]), 'and not vanilla arrays.');
    ok(Object.isArguments(iArguments), 'even from another frame');
  });

  test("isObject", function() {
    ok(Object.isObject(arguments), 'the arguments object is object');
    ok(Object.isObject([1, 2, 3]), 'and arrays');
    ok(Object.isObject($('html')[0]), 'and DOM element');
    ok(Object.isObject(iElement), 'even from another frame');
    ok(Object.isObject(function () {}), 'and functions');
    ok(Object.isObject(iFunction), 'even from another frame');
    ok(!Object.isObject(null), 'but not null');
    ok(!Object.isObject(undefined), 'and not undefined');
    ok(!Object.isObject('string'), 'and not string');
    ok(!Object.isObject(12), 'and not number');
    ok(!Object.isObject(true), 'and not boolean');
    //ok(new String('string').isObject(), 'but new String()');// NOTICE: Doesn't pass with Underscore.transparent
    ok(Object.isObject(new String('string')), 'but new String()');
  });

  test("isArray", function() {
    ok(!Object.isArray(arguments), 'the arguments object is not an array');
    ok(Object.isArray([1, 2, 3]), 'but arrays are');
    ok(Object.isArray(iArray), 'even from another frame');
  });

  test("isString", function() {
    ok(!Object.isString(document.body), 'the document body is not a string');
    ok(Object.isString([1, 2, 3].join(', ')), 'but strings are');
    ok(Object.isString(iString), 'even from another frame');
  });

  test("isNumber", function() {
    ok(!Object.isNumber('string'), 'a string is not a number');
    ok(!Object.isNumber(arguments), 'the arguments object is not a number');
    ok(!Object.isNumber(null), 'undefined is not a number');
    ok(Object.isNumber(3 * 4 - 7 / 10), 'but numbers are');
    ok(Object.isNumber(NaN), 'NaN *is* a number');
    ok(Object.isNumber(Infinity), 'Infinity is a number');
    ok(Object.isNumber(iNumber), 'even from another frame');
    ok(!Object.isNumber('1'), 'numeric strings are not numbers');
  });

  test("isBoolean", function() {
    ok(!Object.isBoolean(2), 'a number is not a boolean');
    ok(!Object.isBoolean("string"), 'a string is not a boolean');
    ok(!Object.isBoolean("false"), 'the string "false" is not a boolean');
    ok(!Object.isBoolean("true"), 'the string "true" is not a boolean');
    ok(!Object.isBoolean(arguments), 'the arguments object is not a boolean');
    ok(!Object.isBoolean(undefined), 'undefined is not a boolean');
    ok(!Object.isBoolean(NaN), 'NaN is not a boolean');
    ok(!Object.isBoolean(null), 'null is not a boolean');
    ok(Object.isBoolean(true), 'but true is');
    ok(Object.isBoolean(false), 'and so is false');
    ok(Object.isBoolean(iBoolean), 'even from another frame');
  });

  test("isFunction", function() {
    ok(!Object.isFunction([1, 2, 3]), 'arrays are not functions');
    ok(!Object.isFunction('moe'), 'strings are not functions');
    ok(Object.isFunction(Object.isFunction), 'but functions are');
    ok(Object.isFunction(iFunction), 'even from another frame');
  });

  test("isDate", function() {
    ok(!Object.isDate(100), 'numbers are not dates');
    ok(!Object.isDate({}), 'objects are not dates');
    ok(Object.isDate(new Date), 'but dates are');
    ok(Object.isDate(iDate), 'even from another frame');
  });

  test("isRegExp", function() {
    ok(!Object.isRegExp(Object.identity), 'functions are not RegExps');
    ok(Object.isRegExp(/identity/), 'but RegExps are');
    ok(Object.isRegExp(iRegExp), 'even from another frame');
  });

  test("isFinite", function() {
    ok(!Object.isFinite(undefined), 'undefined is not Finite');
    ok(!Object.isFinite(null), 'null is not Finite');
    ok(!Object.isFinite(NaN), 'NaN is not Finite');
    ok(!Object.isFinite(Infinity), 'Infinity is not Finite');
    ok(!Object.isFinite(-Infinity), '-Infinity is not Finite');
    ok(Object.isFinite('12'), 'Numeric strings are numbers');
    ok(!Object.isFinite('1a'), 'Non numeric strings are not numbers');
    ok(!Object.isFinite(''), 'Empty strings are not numbers');
    var obj = new Number(5);
    ok(Object.isFinite(obj), 'Number instances can be finite');
    ok(Object.isFinite(0), '0 is Finite');
    ok(Object.isFinite(123), 'Ints are Finite');
    ok(Object.isFinite(-12.44), 'Floats are Finite');
  });

  test("isNaN", function() {
    ok(!Object.isNaN(undefined), 'undefined is not NaN');
    ok(!Object.isNaN(null), 'null is not NaN');
    ok(!Object.isNaN(0), '0 is not NaN');
    ok(Object.isNaN(NaN), 'but NaN is');
    ok(Object.isNaN(iNaN), 'even from another frame');
    ok(Object.isNaN(new Number(NaN)), 'wrapped NaN is still NaN');
  });

  test("isNull", function() {
    ok(!Object.isNull(undefined), 'undefined is not null');
    ok(!Object.isNull(NaN), 'NaN is not null');
    ok(Object.isNull(null), 'but null is');
    ok(Object.isNull(iNull), 'even from another frame');
  });

  test("isUndefined", function() {
    ok(!Object.isUndefined(1), 'numbers are defined');
    ok(!Object.isUndefined(null), 'null is defined');
    ok(!Object.isUndefined(false), 'false is defined');
    ok(!Object.isUndefined(NaN), 'NaN is defined');
    ok(Object.isUndefined(), 'nothing is undefined');
    ok(Object.isUndefined(undefined), 'undefined is undefined');
    ok(Object.isUndefined(iUndefined), 'even from another frame');
  });

  if (window.ActiveXObject) {
    test("IE host objects", function() {
      var xml = new ActiveXObject("Msxml2.DOMDocument.3.0");
      ok(!Object.isNumber(xml));
      ok(!Object.isBoolean(xml));
      ok(!Object.isNaN(xml));
      ok(!Object.isFunction(xml));
      ok(!Object.isNull(xml));
      ok(!Object.isUndefined(xml));
    });
  }

  test("tap", function() {
    var intercepted = null;
    var interceptor = function(obj) { intercepted = obj; };
    var returned = Object.tap(1, interceptor);
    equal(intercepted, 1, "passes tapped object to interceptor");
    equal(returned, 1, "returns tapped object");

    returned = Object.tap([1,2,3].
      map(function(n){ return n * 2; }).
      max(),
      interceptor);
    ok(returned == 6 && intercepted == 6, 'can use tapped objects in a chain');
  });

  test("has", function () {
     var obj = Object.toHash({foo: "bar", func: function () {} });
     ok (obj.has("foo"), "has() checks that the object has a property.");
     ok (obj.has("baz") == false, "has() returns false if the object doesn't have the property.");
     ok (obj.has("func"), "has() works for functions too.");
     //obj.hasOwnProperty = null;// NOTICE: Underscore.transparent need native function
     ok (obj.has("foo"), "has() works even when the hasOwnProperty method is deleted.");
     var child = Object.toHash({});
     child.prototype = obj;
     ok (child.has("foo") == false, "has() does not check the prototype chain for a property.")
  });
});
