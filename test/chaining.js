$(document).ready(function() {

  module("Chaining");

  test("map/flatten/reduce", function() {
    var lyrics = [
      "I'm a lumberjack and I'm okay",
      "I sleep all night and I work all day",
      "He's a lumberjack and he's okay",
      "He sleeps all night and he works all day"
    ];
    var counts = lyrics
      .map(function(line) { return line.split(''); })
      .flatten()
      .reduce(function(hash, l) {
        hash[l] = hash[l] || 0;
        hash[l]++;
        return hash;
    }, {});
    ok(counts['a'] == 16 && counts['e'] == 10, 'counted all the letters in the song');
  });

  test("select/reject/sortBy", function() {
    var numbers = [1,2,3,4,5,6,7,8,9,10];
    numbers = numbers.select(function(n) {
      return n % 2 == 0;
    }).reject(function(n) {
      return n % 4 == 0;
    }).sortBy(function(n) {
      return -n;
    });
    equal(numbers.join(', '), "10, 6, 2", "filtered and reversed the numbers");
  });

  test("select/reject/sortBy in functional style", function() {
    var numbers = [1,2,3,4,5,6,7,8,9,10];
    numbers = numbers.select(function(n) {
      return n % 2 == 0;
    }).reject(function(n) {
      return n % 4 == 0;
    }).sortBy(function(n) {
      return -n;
    });
    equal(numbers.join(', '), "10, 6, 2", "filtered and reversed the numbers");
  });

  test("reverse/concat/unshift/pop/map", function() {
    var numbers = [1,2,3,4,5];
    numbers = numbers.chain()
      .reverse()
      .concat([5, 5, 5])
      .unshift(17)
      .pop()
      .map(function(n){ return n * 2; })
      .value();// NOTICE: Chaining methods are required here by Underscore.transparent because native unshift() and pop() methods don't return the current array
    equal(numbers.join(', '), "34, 10, 8, 6, 4, 2, 10, 10", 'can chain together array functions.');
  });

});
