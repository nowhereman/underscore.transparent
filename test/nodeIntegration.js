//Usage: mocha test/nodeIntegration.js
"use strict";
var expect = require("expect.js");
var _;
describe('Node.js integration', function() {
  before(function() {
    _ = require('underscore');
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

    require('../lib/underscore.transparent');
  });
  describe('Native Object', function() {
    before(function() {
      var options = {scope: global};
      _.transparent(options);
    });
    
    describe('toHash', function() {
      it('should be available as global function', function() {
        expect(toHash({foo:"bar"})).eql({foo:"bar"});
        expect(global.toHash({foo:"bar"})).eql({foo:"bar"});
        expect(Object.toHash({foo:"bar"})).eql({foo:"bar"});
      });
    });
    
    it("shouldn't have Underscore available as Object.prototype functions", function() {
      expect(isUndefined({one : 1, two : 2, three : 3}.keys)).ok();
      expect(isUndefined({one : 1, two : 2, three : 3}.values)).ok();
      expect(isUndefined({one : 1, two : 2, three : 3}.contains)).ok();
    });
    
    describe('convert to Hash', function() {
      it('should have Underscore available as Object.prototype functions', function() {
        expect(isFunction(toHash({one : 1, two : 2, three : 3}).keys)).ok();
        expect(toHash({one : 1, two : 2, three : 3}).keys()).eql(["one", "two", "three"]);
        expect(toHash({one : 1, two : 2, three : 3}).values()).eql([1, 2, 3]);
        expect(toHash({one : 1, two : 2, three : 3}).contains(3)).ok();
      });
    });
  });
  
  describe('Object extended', function() {
    before(function() {
      //In Node.js we can safely extends all Underscore and Underscore.string functions to built-in JavaScript objects
      var options = {extendAll: true, scope: global};
      _.transparent(options);
    });
    
    describe('Array.prototype', function() {
      it('should inherit Underscore functions', function() {
        var result = [];
        ['zero', 'one', 'two'].each(function(element, index) { result.push(index+':'+element); });
        expect(result.join(';')).equal("0:zero;1:one;2:two");
      });
      it('should chain Underscore functions', function() {
        expect([2, 1, 3, [5, 8, 3, 9], null, false].flatten().compact().uniq().shuffle().sort()).eql([1, 2, 3, 5, 8, 9]);
      });
    });
    
    describe('String.prototype', function() {
      it('should inherit Underscore.string functions', function() {
        expect("   epeli  ".trim().capitalize()).equal("Epeli");
      });
    });
    
    describe('is[Type]', function() {
      it('should be available as global functions', function() {
        expect(isString("my string")).ok();
        expect(global.isString("my string")).ok();
        expect(root.isString("my string")).ok();
        expect(Object.isString("my string")).ok();
        expect(Object.isObject("my string")).equal(false);
        expect(Object.isObject({})).ok();
      });
      it('should be available as prototype functions', function() {
        expect("my string".isString()).ok();
        expect({foo:"bar"}.isObject()).ok();
      });
    });
    
    describe('toHash', function() {
      it('should be available as global function', function() {
        expect(toHash({foo:"bar"})).eql({foo:"bar"});
        expect(global.toHash({foo:"bar"})).eql({foo:"bar"});
        expect(Object.toHash({foo:"bar"})).eql({foo:"bar"});
      });
    });
    
    describe('with Underscore functions', function() {
      it('should have Object.prototype functions', function() {
        expect(isFunction({one : 1, two : 2, three : 3}.keys)).ok();
        expect({one : 1, two : 2, three : 3}.keys()).eql(["one", "two", "three"]);
        expect({one : 1, two : 2, three : 3}.values()).eql([1, 2, 3]);
        expect({one : 1, two : 2, three : 3}.contains(3)).ok();
      });
    });
  });
});

