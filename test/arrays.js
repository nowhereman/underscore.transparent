$(document).ready(function() {

  module("Arrays");

  test("first", function() {
    equal([1,2,3].first(), 1, 'can pull out the first element of an array');
    equal([1, 2, 3].first(), 1, 'can perform OO-style "first()"');
    equal([1,2,3].first(0).join(', '), "", 'can pass an index to first');
    equal([1,2,3].first(2).join(', '), '1, 2', 'can pass an index to first');
    equal([1,2,3].first(5).join(', '), '1, 2, 3', 'can pass an index to first');
    var result = (function(){ return Object.toArray(arguments).first(); })(4, 3, 2, 1);
    equal(result, 4, 'works on an arguments object.');
    result = [[1,2,3],[1,2,3]].map(_.first);
    equal(result.join(','), '1,1', 'works well with _.map');
    result = (function() { return [1,2,3].take(2); })();
    equal(result.join(','), '1,2', 'aliased as take');

    //equal(null.first(), undefined, 'handles nulls');//Underscore.transparent can't handle null, prefer empty object
  });

  test("rest", function() {
    var numbers = [1, 2, 3, 4];
    equal(numbers.rest().join(", "), "2, 3, 4", 'working rest()');
    equal(numbers.rest(0).join(", "), "1, 2, 3, 4", 'working rest(0)');
    equal(numbers.rest(2).join(', '), '3, 4', 'rest can take an index');
    var result = (function(){ return Object.toArray(arguments).tail(); })(1, 2, 3, 4);
    equal(result.join(', '), '2, 3, 4', 'aliased as tail and works on arguments object');
    result = [[1,2,3],[1,2,3]].map(_.rest);
    equal(result.flatten().join(','), '2,3,2,3', 'works well with _.map');
    result = (function(){ return Object.toArray(arguments).drop(); })(1, 2, 3, 4);
    equal(result.join(', '), '2, 3, 4', 'aliased as drop and works on arguments object');
  });

  test("initial", function() {
    equal([1,2,3,4,5].initial().join(", "), "1, 2, 3, 4", 'working initial()');
    equal([1,2,3,4].initial(2).join(", "), "1, 2", 'initial can take an index');
    var result = (function(){ return Object.toArray(arguments).initial(); })(1, 2, 3, 4);
    equal(result.join(", "), "1, 2, 3", 'initial works on arguments object');
    result = [[1,2,3],[1,2,3]].map(_.initial);
    equal(result.flatten().join(','), '1,2,1,2', 'initial works with _.map');
  });

  test("last", function() {
    equal([1,2,3].last(), 3, 'can pull out the last element of an array');
    equal([1,2,3].last(0).join(', '), "", 'can pass an index to last');
    equal([1,2,3].last(2).join(', '), '2, 3', 'can pass an index to last');
    equal([1,2,3].last(5).join(', '), '1, 2, 3', 'can pass an index to last');
    var result = (function(){ return Object.toArray(arguments).last(); })(1, 2, 3, 4);
    equal(result, 4, 'works on an arguments object');
    result = [[1,2,3],[1,2,3]].map(_.last);
    equal(result.join(','), '3,3', 'works well with _.map');

    //equal(null.last(), undefined, 'handles nulls');//Underscore.transparent can't handle null, prefer empty object
  });

  test("compact", function() {
    equal([0, 1, false, 2, false, 3].compact().length, 3, 'can trim out all falsy values');
    var result = (function(){ return Object.toArray(arguments).compact().length; })(0, 1, false, 2, false, 3);
    equal(result, 3, 'works on an arguments object');
  });

  test("flatten", function() {
    var list = [1, [2], [3, [[[4]]]]];
    deepEqual(list.flatten(), [1,2,3,4], 'can flatten nested arrays');
    deepEqual(list.flatten(true), [1,2,3,[[[4]]]], 'can shallowly flatten nested arrays');
    var result = (function(){ return Object.toArray(arguments).flatten(); })(1, [2], [3, [[[4]]]]);
    deepEqual(result, [1,2,3,4], 'works on an arguments object');
  });

  test("without", function() {
    var list = [1, 2, 1, 0, 3, 1, 4];
    equal(list.without(0, 1).join(', '), '2, 3, 4', 'can remove all instances of an object');
    var result = (function(){ return Object.toArray(arguments).without(0, 1); })(1, 2, 1, 0, 3, 1, 4);
    equal(result.join(', '), '2, 3, 4', 'works on an arguments object');

    var list = [{one : 1}, {two : 2}];
    ok(list.without({one : 1}).length == 2, 'uses real object identity for comparisons.');
    ok(list.without(list[0]).length == 1, 'ditto.');
  });

  test("uniq", function() {
    var list = [1, 2, 1, 3, 1, 4];
    equal(list.uniq().join(', '), '1, 2, 3, 4', 'can find the unique values of an unsorted array');

    var list = [1, 1, 1, 2, 2, 3];
    equal(list.uniq(true).join(', '), '1, 2, 3', 'can find the unique values of a sorted array faster');

    var list = [{name:'moe'}, {name:'curly'}, {name:'larry'}, {name:'curly'}];
    var iterator = function(value) { return value.name; };
    equal(list.uniq(false, iterator).map(iterator).join(', '), 'moe, curly, larry', 'can find the unique values of an array using a custom iterator');

    equal(list.uniq(iterator).map(iterator).join(', '), 'moe, curly, larry', 'can find the unique values of an array using a custom iterator without specifying whether array is sorted');

    var iterator = function(value) { return value +1; };
    var list = [1, 2, 2, 3, 4, 4];
    equal(list.uniq(true, iterator).join(', '), '1, 2, 3, 4', 'iterator works with sorted array');

    var result = (function(){ return Object.toArray(arguments).uniq(); })(1, 2, 1, 3, 1, 4);
    equal(result.join(', '), '1, 2, 3, 4', 'works on an arguments object');
  });

  test("intersection", function() {
    var stooges = ['moe', 'curly', 'larry'], leaders = ['moe', 'groucho'];
    equal(stooges.intersection(leaders).join(''), 'moe', 'can take the set intersection of two arrays');
    equal(stooges.intersection(leaders).join(''), 'moe', 'can perform an OO-style intersection');
    var result = (function(){ return Object.toArray(arguments).intersection(leaders); })('moe', 'curly', 'larry');
    equal(result.join(''), 'moe', 'works on an arguments object');
  });

  test("union", function() {
    var result = [1, 2, 3].union([2, 30, 1], [1, 40]);
    equal(result.join(' '), '1 2 3 30 40', 'takes the union of a list of arrays');

    var result = [1, 2, 3].union([2, 30, 1], [1, 40, [1]]);
    equal(result.join(' '), '1 2 3 30 40 1', 'takes the union of a list of nested arrays');
  });

  test("difference", function() {
    var result = [1, 2, 3].difference([2, 30, 40]);
    equal(result.join(' '), '1 3', 'takes the difference of two arrays');

    var result = [1, 2, 3, 4].difference([2, 30, 40], [1, 11, 111]);
    equal(result.join(' '), '3 4', 'takes the difference of three arrays');
  });

  test('zip', function() {
    var names = ['moe', 'larry', 'curly'], ages = [30, 40, 50], leaders = [true];
    var stooges = names.zip(ages, leaders);
    equal(String(stooges), 'moe,30,true,larry,40,,curly,50,', 'zipped together arrays of different lengths');
  });

  test('object', function() {
    var result = Object.toHash(['moe', 'larry', 'curly'].object([30, 40, 50]));
    var shouldBe = {moe: 30, larry: 40, curly: 50};
    ok(result.isEqual(shouldBe), 'two arrays zipped together into an object');

    result = Object.toHash([['one', 1], ['two', 2], ['three', 3]].object());
    shouldBe = {one: 1, two: 2, three: 3};
    ok(result.isEqual(shouldBe), 'an array of pairs zipped together into an object');

    var stooges = Object.toHash({moe: 30, larry: 40, curly: 50});
    ok(Object.isEqual(stooges.pairs().object(), stooges), 'an object converted to pairs and back to an object');

    //ok(null.object().isEqual({}), 'handles nulls');//Underscore.transparent can't handle null, prefer empty object
  });

  test("indexOf", function() {
    var numbers = [1, 2, 3];
    //numbers.indexOf = null;//Underscore.transparent need native function
    //equal(numbers.indexOf(2), 1, 'can compute indexOf, even without the native function');//Underscore.transparent need native function
    var result = (function(){ return Object.toArray(arguments).indexOf(2); })(1, 2, 3);
    equal(result, 1, 'works on an arguments object');
    //equal(null.indexOf(2), -1, 'handles nulls properly');//Underscore.transparent can't handle null, prefer empty object

    var numbers = [10, 20, 30, 40, 50], num = 35;
    var index = numbers.indexOf(num, true);
    equal(index, -1, '35 is not in the list');

    numbers = [10, 20, 30, 40, 50]; num = 40;
    index = numbers.indexOf(num, true);
    equal(index, 3, '40 is in the list');

    numbers = [1, 40, 40, 40, 40, 40, 40, 40, 50, 60, 70]; num = 40;
    index = numbers.indexOf(num, true);
    equal(index, 1, '40 is in the list');

    numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3];
    index = numbers.indexOf(2, 5);
    equal(index, 7, 'supports the fromIndex argument');
  });

  test("lastIndexOf", function() {
    var numbers = [1, 0, 1];
    equal(numbers.lastIndexOf(1), 2);

    numbers = [1, 0, 1, 0, 0, 1, 0, 0, 0];
    //numbers.lastIndexOf = null;//Underscore.transparent need native function
    //equal(numbers.lastIndexOf(1), 5, 'can compute lastIndexOf, even without the native function');//Underscore.transparent need native function
    equal(numbers.lastIndexOf(0), 8, 'lastIndexOf the other element');
    var result = (function(){ return Object.toArray(arguments).lastIndexOf(1); })(1, 0, 1, 0, 0, 1, 0, 0, 0);
    equal(result, 5, 'works on an arguments object');
    //equal(null.indexOf(2), -1, 'handles nulls properly');//Underscore.transparent can't handle null, prefer empty object

    numbers = [1, 2, 3, 1, 2, 3, 1, 2, 3];
    var index = numbers.lastIndexOf(2, 2);
    equal(index, 1, 'supports the fromIndex argument');
  });

  test("range", function() {
    equal(Object.range(0).join(''), '', 'range with 0 as a first argument generates an empty array');
    equal(Object.range(4).join(' '), '0 1 2 3', 'range with a single positive argument generates an array of elements 0,1,2,...,n-1');
    equal(Object.range(5, 8).join(' '), '5 6 7', 'range with two arguments a &amp; b, a&lt;b generates an array of elements a,a+1,a+2,...,b-2,b-1');
    equal(Object.range(8, 5).join(''), '', 'range with two arguments a &amp; b, b&lt;a generates an empty array');
    equal(Object.range(3, 10, 3).join(' '), '3 6 9', 'range with three arguments a &amp; b &amp; c, c &lt; b-a, a &lt; b generates an array of elements a,a+c,a+2c,...,b - (multiplier of a) &lt; c');
    equal(Object.range(3, 10, 15).join(''), '3', 'range with three arguments a &amp; b &amp; c, c &gt; b-a, a &lt; b generates an array with a single element, equal to a');
    equal(Object.range(12, 7, -2).join(' '), '12 10 8', 'range with three arguments a &amp; b &amp; c, a &gt; b, c &lt; 0 generates an array of elements a,a-c,a-2c and ends with the number not less than b');
    equal(Object.range(0, -10, -1).join(' '), '0 -1 -2 -3 -4 -5 -6 -7 -8 -9', 'final example in the Python docs');
  });

});
