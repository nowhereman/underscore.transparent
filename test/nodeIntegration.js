//Usage: mocha --ui tdd test/nodeIntegration.js
var assert = require("assert")
suite('Node.js integration', function() {
  setup(function() {
    var _ = require('underscore');
    //Alias Underscore conflict functions
    _.mixin({
      encode: _.escape,
      decode: _.unescape,
      isNaNumber: _.isNaN
    });
    
    // Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
    _.str = require('underscore.string');
    // Mix in non-conflict functions and aliasing conflict functions to Underscore namespace, more info at https://github.com/epeli/underscore.string#readme
    _.mixin(_(_.str.exports()).extend({
      includeString: _.str.include,
      containsString: _.str.contains,
      reverseString: _.str.reverse
    }));

    var options = {extendAll: true};//In Node.js we can safely extends all Underscore and Underscore.string functions to built-in JavaScript objects
    require('underscore.transparent');
    _.transparent(options);
  });
  
  suite('Array.prototype', function() {
    test('should inherit Underscore functions', function() {
      var result = [];
      ['zero', 'one', 'two'].each(function(element, index) { result.push(index+':'+element); });
      assert.equal(result.join(';'), "0:zero;1:one;2:two");
    });
    test('should chain Underscore functions', function() {
      assert.deepEqual([2, 1, 3, [5, 8, 3, 9], null, false].flatten().compact().uniq().shuffle().sort(), [1, 2, 3, 5, 8, 9]);
    });
  });
  suite('String.prototype', function() {
    test('should inherit Underscore.string functions', function() {
      assert.equal("   epeli  ".trim().capitalize(), "Epeli");
    });
  });
  suite('is[Type]', function() {
    test('should be available as global functions', function() {
      assert.equal(isString("my string"), false);
      assert.ok(global.isString("my string"));
      assert.ok(root.isString("my string"));
      assert.ok(Object.isString("my string"));
      assert.equal(Object.isObject("my string"), false);
      assert.ok(Object.isObject({}));
    });
    test('should be available as prototype functions', function() {
      assert.ok("my string".isString());
      assert.ok({foo:"bar"}.isObject());
    });
  });
});

