//  Underscore.transparent
//  Push Underscore.js and Underscore.string functions to native JavaScript Objects.
//  (c) 2013 Nowhere man https://github.com/nowhereman
//  Underscore.transparent is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/nowhereman/underscore.transparent
//  Some code is borrowed from Underscore, Underscore.string (https://github.com/epeli/underscore.string) and Sugar (http://sugarjs.com).
//  Version '0.4.3'

!(function(root, Object) {
  "use strict";
  var
    _ = root._ || ( typeof require === 'undefined' ? {} : require('underscore')),
    
    object = Object,
    
    ArrayProto = Array.prototype,
    
    //TODO: To safe space, try to used indexes of the array that contains Underscore functions: _.keys(_.prototype).sort()
    // Notice that the space gain is more important on minified and unzipped file than minified and gzipped file O_o
    defaultObjectProperties = {
      'Collection': [// Array or Object functions
        'each', 'map', 'reduce', 'reduceRight', 'find', 'filter', 'where', 'findWhere', 'reject',
        'every', 'some', 'contains', 'invoke', 'pluck', 'max', 'min', 'sortBy', 'groupBy', 'countBy', 'shuffle',
        'toArray', 'size',
        // Alias functions
        'forEach', 'collect', 'inject', 'foldl', 'foldr', 'detect', 'select', 'all', 'any', 'include',
        //Chaining functions
        'chain', 'value'
       ],
      'Array': [
        'first', 'initial', 'last', 'rest', 'compact', 'flatten', 'without', 'union', 'intersection',
        'difference', 'uniq', 'zip', 'object', 'indexOf', 'lastIndexOf', 'sortedIndex',
        // Alias functions
        'head', 'take', 'tail', 'drop',
        // Underscore.string functions
        'toSentence', 'toSentenceSerial'
      ],
      'Function': ['bind', 'bindAll', 'partial', 'memoize', 'delay', 'defer', 'throttle', 'debounce', 'once',
         'after', 'wrap', 'compose'
      ],
      'Object': ['keys', 'values', 'pairs', 'invert', 'functions', 'extend', 'pick', 'omit', 'defaults', 'clone',
        'tap', 'has', 'isEqual', 'isEmpty', 'isElement', 'isArray', 'isObject', 'isArguments', 'isFunction',
        'isString', 'isNumber', 'isFinite', 'isBoolean', 'isDate', 'isRegExp', 'isNaN', 'isNull', 'isUndefined',
        //Utility functions
        'identity', 'result', 'range', //range is a Underscore Array function but not a Array prototyped function
        //Function function
        'bindAll'
      ],
      'Number': [
        //Utility function
        'times',
        //Function function
        'after'
      ],
      'String': [
        //Chaining functions
        'chain', 'unescape', 'value',
        //Utility functions
        'escape', 'unescape', 'template',
        // Underscore.string functions
        'numberFormat', 'levenshtein', 'capitalize', 'chop', 'clean', 'chars', 'swapCase', 'count',
        'escapeHTML', 'unescapeHTML', 'escapeRegExp', 'insert', 'isBlank', 'join', 'lines', 'splice', 'startsWith',
        'endsWith', 'succ', 'titleize', 'camelize', 'classify', 'underscored', 'dasherize', 'humanize',
        'trim', 'ltrim', 'rtrim', 'truncate', 'prune', 'words', 'sprintf', 'vsprintf', 'pad', 'lpad', 'rpad', 'lrpad', 'toNumber',
        'strRight', 'strRightBack', 'strLeft', 'strLeftBack', 'stripTags', 'repeat',
        'surround', 'quote', 'slugify', //, 'include', 'reverse'
        //NOTICE: include, reverse and contains functions are in conflict with Underscore
        // Underscore.string alias functions
        'strip', 'lstrip', 'rstrip', 'center', 'ljust', 'rjust', 'q', 'includeString', 'reverseString', 'containsString'//, 'contains'
      ],
      'Type': [
        // Collection functions
        'toArray',
        // Object functions
        'isEqual', 'isEmpty', 'isElement', 'isArray', 'isObject', 'isArguments', 'isFunction',
        'isString', 'isNumber', 'isFinite', 'isBoolean', 'isDate', 'isRegExp', 'isNaN', 'isNull', 'isUndefined',
        // Underscore.string functions
        'isBlank', 'toNumber',
        // Alias function for `isNaN`
        'isNaNumber'
      ],
      'Utility': [
        'noConflict', 'identity', 'times', 'random', 'mixin', 'uniqueId', 'escape', 'unescape', 'result', 'template',
        // Alias functions for `escape` and `unescape`
        'encode', 'decode'
      ]
      // Chaining: `chain()` and `value()` are most of the time useless with Underscore.transparent !
      // You just have to be careful when you used native functions who don't return the current object (E.g. Array.prototype.[push|pop|shift|unshift])
      // E.g. without `chain()` and `value()` functions :
      // var stooges = [{name : 'curly', age : 25}, {name : 'moe', age : 21}, {name : 'larry', age : 23}];
      // var youngest = _.chain(stooges)
      //  .sortBy(function(stooge) { return stooge.age; })
      //  .map(function(stooge) { return stooge.name + ' is ' + stooge.age; })
      //  .first()
      //  .value();//=> "moe is 21"
      // Becomes :
      // var youngest = stooges
      //  .sortBy(function(stooge) { return stooge.age; })
      //  .map(function(stooge) { return stooge.name + ' is ' + stooge.age; })
      //  .first();//=> "moe is 21"
    
    },
    
    globalOptions = { objectProperties: defaultObjectProperties },
    
    // Native native JS functions to exclude because Underscore and Underscore.string add extra params to these functions
    nativeFunctions = [
      //forEach', // Array.prototype.forEach OK!
      //'map', //Array.prototype.map OK!
      'reduce', //Array.prototype.reduce Underscore add `context` arg
      'reduceRight', //Array.prototype.reduceRight Underscore add `context` arg
      //'filter', //Array.prototype.filter OK!
      //'every', //Array.prototype.every OK!
      'some', //Array.prototype.some Underscore `iterator` arg is optional
      //'indexOf', //Array.prototype.indexOf OK!
      //'lastIndexOf', // Array.prototype.lastIndexOf OK!
      //'isArray', //Array.isArray OK!
      //'keys', //Object.keys OK!
      //'bind', //Function.prototype.bind OK!
      //'quote', //String.prototype.quote Notice that Underscore.string function doesn't return an evaluable string
      'trim' //String.prototype.trim Underscore.string add an optional `characters` arg that native function doesn't support
      //'trimRight', //String.prototype.trimRight OK! Underscore.string has `rtrim` function
      //'trimLeft', //String.prototype.trimLeft OK! Underscore.string has `ltrim` function
      //'escape', //window.escape Notice: Underscore.js doesn't have the same behaviour.
      //'unescape', //window.unescape Notice: Underscore.js doesn't have the same behaviour.
      //'isFinite', //window.isFinite OK!
      //'isNaN' //window.isNaN Notice: This is not the same as the Underscore `_.isNaN` function. isNaN(undefined) => true _.isNaN(undefined) => false
      //  and isNaN("ff") => true _.isNaN("ff") => false
    ],
    
    hasOwnProperty = function (obj, key) {
      return object['hasOwnProperty'].call(obj, key);
    },
    
    //IE 9 and below don't support `Object.prototype.constructor.name`
    getConstructorName = function (obj) {
      var s;
      if (typeof obj !== "undefined" && obj !== null && obj.constructor) {
        if (obj.constructor.name) {
          s = obj.constructor.name;
        } else {
          s = obj.constructor.toString().match(/^\n{0,}function\s(.+)\(/);
          s = s ? s[1] : undefined;
        }
      }

      return s;
    },
    
    // Borrowed from Underscore.js
    // Extend a given object with all the owned properties in passed-in object(s).
    merge = function(obj) {
      _.each(ArrayProto.slice.call(arguments, 1), function(source) {
        if (source) {
          var property;
          for (property in source) {
            if (hasOwnProperty(source, property)) {
              obj[property] = source[property];
            }
          }
        }
      });
      return obj;
    },
    
    definePropertySupport = object.defineProperty && object.defineProperties,
    
    defineProperty = function (target, name, property) {
      if (definePropertySupport) {
        object.defineProperty(target, name, { 'value': property, 'configurable': true, 'enumerable': false, 'writable': true });
      } else {
        target[name] = property;
      }
    },
    
    mixinProperties = function(property, obj) {
      var functions = _.functions(obj),
          targets = ['Collection', 'Function', 'String', 'Utility'],
          objectProperties = {};
      _.each(targets, function(target) { 
        objectProperties[target] = functions;
      });
      _transp.transparent({ objectProperties: objectProperties });
    },
    
    setProperty = function(target, property, scope) {
      if (!scope) {
        scope = root;
      }
      
      if (_.contains(['Hash', 'String', 'Utility'], target)) {// class method
        if (!hasOwnProperty(scope['Object'], property) && _[property]) {
          defineProperty(scope['Object'], property, function() {
            var args = _.toArray(arguments),
                newProperty = _[property].apply(null, args);
            if (target === 'Utility' && property === 'mixin') {
              mixinProperties(property, args[0]);
            }
            return newProperty;
            
          });
        }
      }
      // Be careful, if `globalOptions.extendAll` is set, compatibility with IE 8 and below is broken
      if (target !== 'Object' || globalOptions.extendAll) { // instance method
        // If `target` hasn't a prototype defined property directly to `scope`, useful for setting `is[Type]` properties to `scope`
        var currentTarget = (scope[target] && scope[target].prototype) ? scope[target].prototype : scope;
        if ((!hasOwnProperty(currentTarget, property) || _.contains(nativeFunctions, property)) && _[property]) {
          defineProperty(currentTarget, property, function() {
            var that = this,
                constructorName = getConstructorName(that),
                args = _.toArray(arguments);
            // Function and Date class must be exclude from the list
            if (_.contains(['Array', 'Arguments', 'Boolean', 'Number', 'Object', 'RegExp', 'String'], constructorName) && scope[constructorName]) {
              that = scope[constructorName](that);
            }
            
            if (scope === that) {
              if (property === 'mixin') {
                var newProperty = _[property].apply(null, args);
                mixinProperties(property, args[0]);
                return newProperty;
              }
            } else {//Don't include current object in args if it's the `scope` (global Object). E.g. `window` variable.
              that = _.isArray(that) ? that : [that];
              args = ArrayProto.concat.apply(that, [args]);
            }
            return _[property].apply(null, args);
          });
        }/* else if (typeof console !== 'undefined' && console.log) {
          console.log("WARN: unable to extend '" + property + "' property of '" + getConstructorName(currentTarget) + "' into built-in JS objects");
        }*/
      }
    },
    
    defineProperties = function(target, properties, scope) {
      _.each(properties, function(property) {
        setProperty(target, property, scope);
      });
    },
    
    _transp = {
      VERSION: '0.4.3',
      // Voodoo magic who inject all Underscore and Underscore.string functions in built-in JavaScript objects
      // options params:
      //  - objectProperties, default is the internal `defaultObjectProperties` object
      //  - scope, default is `root` (`window` is a Web browser)
      transparent: function (options) {
        if (!options) {
          options = {};
        }
        options = _.extend(globalOptions, options);
        var objects = options.objectProperties;
        // Default value for arg
        if (!objects['Array']) {
          objects['Array'] = [];
        }
        if (!objects['Object']) {
          objects['Object'] = [];
        }

        if (!_.isEmpty(objects['Collection'])) {
          var collectionProperties = _.clone(objects['Collection']);
          delete objects['Collection'];
          objects['Array'] = objects['Array'].concat(collectionProperties);
          objects['Object'] = objects['Object'].concat(collectionProperties);
        }
        if (!objects['Hash']) {
          objects['Hash'] = objects['Object'];
        }
        if (!_.isEmpty(objects['String'])) {
          objects['Number'] = (objects['Number']||[]).concat(objects['String']);
        }
        var target;
        for(target in objects) {
          if (hasOwnProperty(objects, target)) {
            var properties = objects[target];
            defineProperties(target, properties, options.scope);
          }
        }
      }
    };
  
  if(_.mixin) {
    _.mixin(_transp);
  }
  
  // Hash definition
    root.Hash = function (obj) {
      merge(this, obj);
    };

    root.Hash.prototype.constructor = object;
  
  defineProperty(object, 'toHash', function(obj) {
    if (obj === null && root !== this && object !== this) {
      obj = this;
    }
    return (_.isObject(obj)) ? new root.Hash(obj) : obj;
  });
  root.toHash = object.toHash;
  
  defineProperty(object, 'toObject', function(obj) {
    if (obj === null && root !== this && object !== this) {
      obj = this;
    }
    return (_.isObject(obj) && obj instanceof Hash) ? merge({}, obj) : obj;
  });
  root.toObject = object.toObject;
  
  // Override  `_.omit`, for copying only the own properties of the source object. IE 8 and below need this
  // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = ArrayProto.concat.apply(ArrayProto, ArrayProto.slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key) && (hasOwnProperty(obj, key) || !_.contains(_.keys(_.prototype), key))) {
        copy[key] = obj[key];
      }
    }
    return copy;
  };
  
  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = _transp;
    }
    exports._transp = _transp;
  }

  // Register as a anonymous module with AMD.
  if (typeof define === 'function' && define.amd) {
    define(function() { return _transp; });
  }
  
})((typeof global === 'undefined') ? this : global, Object);
