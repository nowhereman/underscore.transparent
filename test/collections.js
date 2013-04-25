$(document).ready(function() {

  module("Collections");

  test("each", function() {
    [1, 2, 3].each(function(num, i) {
      equal(num, i + 1, 'each iterators provide value and iteration count');
    });

    var answers = [];
    [1, 2, 3].each(function(num){ answers.push(num * this.multiplier);}, {multiplier : 5});
    equal(answers.join(', '), '5, 10, 15', 'context object property accessed');

    answers = [];
    [1, 2, 3].forEach(function(num){ answers.push(num); });
    equal(answers.join(', '), '1, 2, 3', 'aliased as "forEach"');

    answers = [];
    var obj = Object.toHash({one : 1, two : 2, three : 3});
    obj.constructor.prototype.four = 4;
    obj.each(function(value, key){ answers.push(key); });
    equal(answers.join(", "), 'one, two, three', 'iterating over objects works, and ignores the object prototype.');
    delete obj.constructor.prototype.four;

    var answer = null;
    [1, 2, 3].each(function(num, index, arr){ if (arr.include(num)) answer = true; });
    ok(answer, 'can reference the original collection from inside the iterator');

    answers = 0;
    Object.each(null, function(){ ++answers; });
    equal(answers, 0, 'handles a null properly');
  });

  test('map', function() {
    var doubled = [1, 2, 3].map(function(num){ return num * 2; });
    equal(doubled.join(', '), '2, 4, 6', 'doubled numbers');

    doubled = [1, 2, 3].collect(function(num){ return num * 2; });
    equal(doubled.join(', '), '2, 4, 6', 'aliased as "collect"');

    var tripled = [1, 2, 3].map(function(num){ return num * this.multiplier; }, {multiplier : 3});
    equal(tripled.join(', '), '3, 6, 9', 'tripled numbers with context');

    var doubled = [1, 2, 3].map(function(num){ return num * 2; });
    equal(doubled.join(', '), '2, 4, 6', 'OO-style doubled numbers');

    if (document.querySelectorAll) {
      var ids = Object.toArray(document.querySelectorAll('#map-test *')).map(function(n){ return n.id; });
      deepEqual(ids, ['id1', 'id2'], 'Can use collection methods on NodeLists.');
    }
    
    // NOTICE: It's use the jQuery.prototype.map function (http://api.jquery.com/map) with Underscore.transparent
    // Doc: jQuery(array).map( callback(index, domElement) )
    var idsFromjQuery = $('#map-test').children().map(function(index, domElement){ return domElement.id; });
    deepEqual(jQuery.makeArray(idsFromjQuery), ['id1', 'id2'], 'Can use jQuery collection methods on jQuery Array-likes.');
    
    idsFromjQuery = jQuery.makeArray($('#map-test').children()).map(function(n){ return n.id; });
    deepEqual(idsFromjQuery, ['id1', 'id2'], 'Can use collection methods on jQuery Array-likes.');
    
    // NOTICE: To used Underscore `map` function with Underscore.transparent, you need to convert your jQuery Object with Object.toArray() function:
    var ids = Object.toArray($('#map-test').children()).map(function(n){ return n.id; });
    deepEqual(ids, ['id1', 'id2'], 'Can use collection methods on jQuery Array-likes.');

    var ids = Object.toArray(document.images).map(function(n){ return n.id; });
    ok(ids[0] == 'chart_image', 'can use collection methods on HTMLCollections');

    var ifnull = Object.map(null, function(){});
    ok(Object.isArray(ifnull) && ifnull.length === 0, 'handles a null properly');
  });

  test('reduce', function() {
    var sum = [1, 2, 3].reduce(function(sum, num){ return sum + num; }, 0);
    equal(sum, 6, 'can sum up an array');

    var context = {multiplier : 3};
    sum = [1, 2, 3].reduce(function(sum, num){ return sum + num * this.multiplier; }, 0, context);
    equal(sum, 18, 'can reduce with a context object');

    sum = [1, 2, 3].inject(function(sum, num){ return sum + num; }, 0);
    equal(sum, 6, 'aliased as "inject"');

    sum = [1, 2, 3].reduce(function(sum, num){ return sum + num; }, 0);
    equal(sum, 6, 'OO-style reduce');

    var sum = [1, 2, 3].reduce(function(sum, num){ return sum + num; });
    equal(sum, 6, 'default initial value');

    var ifnull;
    try {
      Object.reduce(null, function(){});
    } catch (ex) {
      ifnull = ex;
    }
    ok(ifnull instanceof TypeError, 'handles a null (without inital value) properly');

    ok(Object.reduce(null, function(){}, 138) === 138, 'handles a null (with initial value) properly');
    equal([].reduce(function(){}, undefined), undefined, 'undefined can be passed as a special case');
    raises(function() { [].reduce(function(){}); }, TypeError, 'throws an error for empty arrays with no initial value');
  });

  test('reduceRight', function() {
    var list = ["foo", "bar", "baz"].reduceRight(function(memo, str){ return memo + str; }, '');
    equal(list, 'bazbarfoo', 'can perform right folds');

    var list = ["foo", "bar", "baz"].foldr(function(memo, str){ return memo + str; }, '');
    equal(list, 'bazbarfoo', 'aliased as "foldr"');

    var list = ["foo", "bar", "baz"].foldr(function(memo, str){ return memo + str; });
    equal(list, 'bazbarfoo', 'default initial value');

    var ifnull;
    try {
      Object.reduceRight(null, function(){});
    } catch (ex) {
      ifnull = ex;
    }
    ok(ifnull instanceof TypeError, 'handles a null (without inital value) properly');

    var sum = Object.toHash({a: 1, b: 2, c: 3}).reduceRight(function(sum, num){ return sum + num; });
    equal(sum, 6, 'default initial value on object');

    ok(Object.reduceRight(null, function(){}, 138) === 138, 'handles a null (with initial value) properly');

    equal([].reduceRight(function(){}, undefined), undefined, 'undefined can be passed as a special case');
    raises(function() { [].reduceRight(function(){}); }, TypeError, 'throws an error for empty arrays with no initial value');

    // Assert that the correct arguments are being passed.

    var args,
        memo = {},
        object = Object.toHash({a: 1, b: 2}),
        lastKey = object.keys().pop();

    var expected = lastKey == 'a'
      ? [memo, 1, 'a', object]
      : [memo, 2, 'b', object];

    object.reduceRight(function() {
      args || (args = Object.toArray(arguments));
    }, memo);

    deepEqual(args, expected);

    // And again, with numeric keys.

    object = Object.toHash({'2': 'a', '1': 'b'});
    lastKey = object.keys().pop();
    args = null;

    expected = lastKey == '2'
      ? [memo, 'a', '2', object]
      : [memo, 'b', '1', object];

    object.reduceRight(function() {
      args || (args = Object.toArray(arguments));
    }, memo);

    deepEqual(args, expected);
  });

  test('find', function() {
    var array = [1, 2, 3, 4];
    strictEqual(array.find(function(n) { return n > 2; }), 3, 'should return first found `value`');
    strictEqual(array.find(function() { return false; }), void 0, 'should return `undefined` if `value` is not found');
  });

  test('detect', function() {
    var result = [1, 2, 3].detect(function(num){ return num * 2 == 4; });
    equal(result, 2, 'found the first "2" and broke the loop');
  });

  test('select', function() {
    var evens = [1, 2, 3, 4, 5, 6].select(function(num){ return num % 2 == 0; });
    equal(evens.join(', '), '2, 4, 6', 'selected each even number');

    evens = [1, 2, 3, 4, 5, 6].filter(function(num){ return num % 2 == 0; });
    equal(evens.join(', '), '2, 4, 6', 'aliased as "filter"');
  });

  test('reject', function() {
    var odds = [1, 2, 3, 4, 5, 6].reject(function(num){ return num % 2 == 0; });
    equal(odds.join(', '), '1, 3, 5', 'rejected each even number');

    var context = "obj";

    var evens = [1, 2, 3, 4, 5, 6].reject(function(num){
      equal(context, "obj");
      return num % 2 != 0;
    }, context);
    equal(evens.join(', '), '2, 4, 6', 'rejected each odd number');
  });

  test('all', function() {
    ok([].all(_.identity), 'the empty set');
    ok([true, true, true].all(_.identity), 'all true values');
    ok(![true, false, true].all(_.identity), 'one false value');
    ok([0, 10, 28].all(function(num){ return num % 2 == 0; }), 'even numbers');
    ok(![0, 11, 28].all(function(num){ return num % 2 == 0; }), 'an odd number');
    ok([1].all(_.identity) === true, 'cast to boolean - true');
    ok([0].all(_.identity) === false, 'cast to boolean - false');
    ok([true, true, true].every(_.identity), 'aliased as "every"');
    ok(![undefined, undefined, undefined].all(_.identity), 'works with arrays of undefined');
  });

  test('any', function() {
    var nativeSome = Array.prototype.some;
    Array.prototype.some = null;
    ok(![].any(), 'the empty set');
    ok(!Object.any([false, false, false]), 'all false values');
    ok(Object.any([false, false, true]), 'one true value');
    ok(Object.any([null, 0, 'yes', false]), 'a string');
    ok(!Object.any([null, 0, '', false]), 'falsy values');
    ok(![1, 11, 29].any(function(num){ return num % 2 == 0; }), 'all odd numbers');
    ok([1, 10, 29].any(function(num){ return num % 2 == 0; }), 'an even number');
    ok([1].any(_.identity) === true, 'cast to boolean - true');
    ok([0].any(_.identity) === false, 'cast to boolean - false');
    ok(Object.some([false, false, true]), 'aliased as "some"');//FIXME for Underscore.transparency
    Array.prototype.some = nativeSome;
  });

  test('include', function() {
    ok([1,2,3].include(2), 'two is in the array');
    ok(![1,3,9].include(2), 'two is not in the array');
    ok(Object.toHash({moe:1, larry:3, curly:9}).contains(3) === true, '_.include on objects checks their values');
    ok([1,2,3].include(2), 'OO-style include');
  });

  test('invoke', function() {
    var list = [[5, 1, 7], [3, 2, 1]];
    var result = list.invoke('sort');
    equal(result[0].join(', '), '1, 5, 7', 'first array sorted');
    equal(result[1].join(', '), '1, 2, 3', 'second array sorted');
  });

  test('invoke w/ function reference', function() {
    var list = [[5, 1, 7], [3, 2, 1]];
    var result = list.invoke(Array.prototype.sort);
    equal(result[0].join(', '), '1, 5, 7', 'first array sorted');
    equal(result[1].join(', '), '1, 2, 3', 'second array sorted');
  });

  // Relevant when using ClojureScript
  test('invoke when strings have a call method', function() {
    String.prototype.call = function() {
      return 42;
    };
    var list = [[5, 1, 7], [3, 2, 1]];
    var s = "foo";
    equal(s.call(), 42, "call function exists");
    var result = list.invoke('sort');
    equal(result[0].join(', '), '1, 5, 7', 'first array sorted');
    equal(result[1].join(', '), '1, 2, 3', 'second array sorted');
    delete String.prototype.call;
    equal(s.call, undefined, "call function removed");
  });

  test('pluck', function() {
    var people = [{name : 'moe', age : 30}, {name : 'curly', age : 50}];
    equal(people.pluck('name').join(', '), 'moe, curly', 'pulls names out of objects');
  });

  test('where', function() {
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}];
    var result = list.where({a: 1});
    equal(result.length, 3);
    equal(result[result.length - 1].b, 4);
    result = list.where({b: 2});
    equal(result.length, 2);
    equal(result[0].a, 1);
  });

  test('findWhere', function() {
    var list = [{a: 1, b: 2}, {a: 2, b: 2}, {a: 1, b: 3}, {a: 1, b: 4}, {a: 2, b: 4}];
    var result = list.findWhere({a: 1});
    deepEqual(result, {a: 1, b: 2});
    result = list.findWhere({b: 4});
    deepEqual(result, {a: 1, b: 4});
  });

  test('max', function() {
    equal(3, [1, 2, 3].max(), 'can perform a regular Math.max');

    var neg = [1, 2, 3].max(function(num){ return -num; });
    equal(neg, 1, 'can perform a computation-based max');

    equal(-Infinity, Object.toHash({}).max(), 'Maximum value of an empty object');
    equal(-Infinity, [].max(), 'Maximum value of an empty array');
    equal(Object.toHash({'a': 'a'}).max(), -Infinity, 'Maximum value of a non-numeric collection');

    equal(299999, Object.range(1,300000).max(), "Maximum value of a too-big array");
  });

  test('min', function() {
    equal(1, [1, 2, 3].min(), 'can perform a regular Math.min');

    var neg = [1, 2, 3].min(function(num){ return -num; });
    equal(neg, 3, 'can perform a computation-based min');

    equal(Infinity, Object.toHash({}).min(), 'Minimum value of an empty object');
    equal(Infinity, [].min(), 'Minimum value of an empty array');
    equal(Object.toHash({'a': 'a'}).min(), Infinity, 'Minimum value of a non-numeric collection');

    var now = new Date(9999999999);
    var then = new Date(0);
    equal([now, then].min(), then);

    equal(1, Object.range(1,300000).min(), "Minimum value of a too-big array");
  });

  test('sortBy', function() {
    var people = [{name : 'curly', age : 50}, {name : 'moe', age : 30}];
    people = people.sortBy(function(person){ return person.age; });
    equal(people.pluck('name').join(', '), 'moe, curly', 'stooges sorted by age');

    var list = [undefined, 4, 1, undefined, 3, 2];
    equal(list.sortBy(_.identity).join(','), '1,2,3,4,,', 'sortBy with undefined values');

    var list = ["one", "two", "three", "four", "five"];
    var sorted = list.sortBy('length');
    equal(sorted.join(' '), 'one two four five three', 'sorted by length');

    function Pair(x, y) {
      this.x = x;
      this.y = y;
    }

    var collection = [
      new Pair(1, 1), new Pair(1, 2),
      new Pair(1, 3), new Pair(1, 4),
      new Pair(1, 5), new Pair(1, 6),
      new Pair(2, 1), new Pair(2, 2),
      new Pair(2, 3), new Pair(2, 4),
      new Pair(2, 5), new Pair(2, 6),
      new Pair(undefined, 1), new Pair(undefined, 2),
      new Pair(undefined, 3), new Pair(undefined, 4),
      new Pair(undefined, 5), new Pair(undefined, 6)
    ];

    var actual = collection.sortBy(function(pair) {
      return pair.x;
    });

    deepEqual(actual, collection, 'sortBy should be stable');
  });

  test('groupBy', function() {
    var parity = [1, 2, 3, 4, 5, 6].groupBy(function(num){ return num % 2; });
    ok('0' in parity && '1' in parity, 'created a group for each value');
    equal(parity[0].join(', '), '2, 4, 6', 'put each even number in the right group');

    var list = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
    var grouped = list.groupBy('length');
    equal(grouped['3'].join(' '), 'one two six ten');
    equal(grouped['4'].join(' '), 'four five nine');
    equal(grouped['5'].join(' '), 'three seven eight');

    var context = {};
    [{}].groupBy(function(){ ok(this === context); }, context);

    grouped = [4.2, 6.1, 6.4].groupBy(function(num) {
      return Math.floor(num) > 4 ? 'hasOwnProperty' : 'constructor';
    });
    equal(grouped.constructor.length, 1);
    equal(grouped.hasOwnProperty.length, 2);

    var array = [{}];
    array.groupBy(function(value, index, obj){ ok(obj === array); });

    var array = [1, 2, 1, 2, 3];
    var grouped = array.groupBy();
    equal(grouped['1'].length, 2);
    equal(grouped['3'].length, 1);
  });

  test('countBy', function() {
    var parity = [1, 2, 3, 4, 5].countBy(function(num){ return num % 2 == 0; });
    equal(parity['true'], 2);
    equal(parity['false'], 3);

    var list = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
    var grouped = list.countBy('length');
    equal(grouped['3'], 4);
    equal(grouped['4'], 3);
    equal(grouped['5'], 3);

    var context = {};
    [{}].countBy(function(){ ok(this === context); }, context);

    grouped = [4.2, 6.1, 6.4].countBy(function(num) {
      return Math.floor(num) > 4 ? 'hasOwnProperty' : 'constructor';
    });
    equal(grouped.constructor, 1);
    equal(grouped.hasOwnProperty, 2);

    var array = [{}];
    array.countBy(function(value, index, obj){ ok(obj === array); });

    var array = [1, 2, 1, 2, 3];
    var grouped = array.countBy();
    equal(grouped['1'], 2);
    equal(grouped['3'], 1);
  });

  test('sortedIndex', function() {
    var numbers = [10, 20, 30, 40, 50], num = 35;
    var indexForNum = numbers.sortedIndex(num);
    equal(indexForNum, 3, '35 should be inserted at index 3');

    var indexFor30 = numbers.sortedIndex( 30);
    equal(indexFor30, 2, '30 should be inserted at index 2');

    var objects = [{x: 10}, {x: 20}, {x: 30}, {x: 40}];
    var iterator = function(obj){ return obj.x; };
    strictEqual(objects.sortedIndex({x: 25}, iterator), 2);
    strictEqual(objects.sortedIndex({x: 35}, 'x'), 3);

    var context = {1: 2, 2: 3, 3: 4};
    iterator = function(obj){ return this[obj]; };
    strictEqual([1, 3].sortedIndex(2, iterator, context), 1);
  });

  test('shuffle', function() {
    var numbers = Object.range(10);
    var shuffled = numbers.shuffle().sort();
    notStrictEqual(numbers, shuffled, 'original object is unmodified');
    equal(shuffled.join(','), numbers.join(','), 'contains the same members before and after shuffle');
  });

  test('toArray', function() {
    ok(!Object.isArray(arguments), 'arguments object is not an array');
    ok(Object.isArray(Object.toArray(arguments)), 'arguments object converted into array');
    var a = [1,2,3];
    ok(Object.toArray(a) !== a, 'array is cloned');
    equal(Object.toArray(a).join(', '), '1, 2, 3', 'cloned array contains same elements');

    var numbers = Object.toHash({one : 1, two : 2, three : 3}).toArray();
    equal(numbers.join(', '), '1, 2, 3', 'object flattened into array');

    // test in IE < 9
    try {
      var actual = Object.toArray(document.childNodes);
    } catch(ex) { }

    ok(Object.isArray(actual), 'should not throw converting a node list');
  });

  test('size', function() {
    equal(Object.toHash({one : 1, two : 2, three : 3}).size(), 3, 'can compute the size of an object');
    equal([1, 2, 3].size(), 3, 'can compute the size of an array');

    var func = function() {
      return Object.size(arguments);
    };

    equal(func(1, 2, 3, 4), 4, 'can test the size of the arguments object');

    equal(Object.size('hello'), 5, 'can compute the size of a string');

    equal(Object.size(null), 0, 'handles nulls');
  });

});
