(function() {

  var numbers = [];
  for (var i=0; i<1000; i++) numbers.push(i);
  var objects = Object.toHash(numbers.map(function(n){ return {num : n}; }));
  var randomized = numbers.sortBy(function(){ return Math.random(); });
  var deep = Object.range(100).map(function() { return Object.range(1000); });

  JSLitmus.test('.each()', function() {
    var timesTwo = [];
    numbers.each(function(num){ timesTwo.push(num * 2); });
    return timesTwo;
  });

  // NOTICE: Useless with Underscore.transparent
  JSLitmus.test('list.each()', function() {
    var timesTwo = [];
    numbers.each(function(num){ timesTwo.push(num * 2); });
    return timesTwo;
  });

  JSLitmus.test('jQuery.each()', function() {
    var timesTwo = [];
    jQuery.each(numbers, function(){ timesTwo.push(this * 2); });
    return timesTwo;
  });

  JSLitmus.test('.map()', function() {
    return objects.map(function(obj){ return obj.num; });
  });

  JSLitmus.test('jQuery.map()', function() {
    return jQuery.map(objects, function(obj){ return obj.num; });
  });

  JSLitmus.test('.pluck()', function() {
    return objects.pluck('num');
  });

  JSLitmus.test('.uniq()', function() {
    return randomized.uniq();
  });

  JSLitmus.test('.uniq() (sorted)', function() {
    return numbers.uniq(true);
  });

  JSLitmus.test('.sortBy()', function() {
    return numbers.sortBy(function(num){ return -num; });
  });

  JSLitmus.test('.isEqual()', function() {
    return Object.isEqual(numbers, randomized);
  });

  JSLitmus.test('.keys()', function() {
    return objects.keys();
  });

  JSLitmus.test('.values()', function() {
    return objects.values();
  });

  JSLitmus.test('.intersection()', function() {
    return numbers.intersection(randomized);
  });

  JSLitmus.test('.range()', function() {
    return Object.range(1000);
  });

  JSLitmus.test('.flatten()', function() {
    return deep.flatten();
  });

})();
