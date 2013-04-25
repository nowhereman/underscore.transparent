$(document).ready(function() {

  module("Functions");

  test("bind", function() {
    var context = {name : 'moe'};
    var func = function(arg) { return "name: " + (this.name || arg); };
    var bound = func.bind(context);
    equal(bound(), 'name: moe', 'can bind a function to a context');

    bound = func.bind(context);
    equal(bound(), 'name: moe', 'can do OO-style binding');

    bound = func.bind(null, 'curly');
    equal(bound(), 'name: curly', 'can bind without specifying a context');

    func = function(salutation, name) { return salutation + ': ' + name; };
    func = func.bind(this, 'hello');
    equal(func('moe'), 'hello: moe', 'the function was partially applied in advance');

    func = func.bind(this, 'curly');
    equal(func(), 'hello: curly', 'the function was completely applied in advance');

    func = function(salutation, firstname, lastname) { return salutation + ': ' + firstname + ' ' + lastname; };
    func = func.bind(this, 'hello', 'moe', 'curly');
    equal(func(), 'hello: moe curly', 'the function was partially applied in advance and can accept multiple arguments');

    func = function(context, message) { equal(this, context, message); };
    func.bind(0, 0, 'can bind a function to `0`')();
    func.bind('', '', 'can bind a function to an empty string')();
    func.bind(false, false, 'can bind a function to `false`')();

    // These tests are only meaningful when using a browser without a native bind function
    // To test this with a modern browser, set underscore's nativeBind to undefined
    var F = function () { return this; };
    var Boundf = F.bind({hello: "moe curly"});
    equal(Boundf().hello, "moe curly", "When called without the new operator, it's OK to be bound to the context");
  });

  test("partial", function() {
    var obj = {name: 'moe'};
    var func = function() { return this.name + ' ' + Object.toArray(arguments).join(' '); };

    obj.func = func.partial('a', 'b');
    equal(obj.func('c', 'd'), 'moe a b c d', 'can partially apply');
  });

  test("bindAll", function() {
    var curly = Object.toHash({name : 'curly'}), moe = Object.toHash({
      name    : 'moe',
      getName : function() { return 'name: ' + this.name; },
      sayHi   : function() { return 'hi: ' + this.name; }
    });
    curly.getName = moe.getName;
    moe.bindAll('getName', 'sayHi');
    curly.sayHi = moe.sayHi;
    equal(curly.getName(), 'name: curly', 'unbound function is bound to current object');
    equal(curly.sayHi(), 'hi: moe', 'bound function is still bound to original object');

    curly = {name : 'curly'};
    moe = Object.toHash({
      name    : 'moe',
      getName : function() { return 'name: ' + this.name; },
      sayHi   : function() { return 'hi: ' + this.name; }
    });
    moe.bindAll();
    curly.sayHi = moe.sayHi;
    equal(curly.sayHi(), 'hi: moe', 'calling bindAll with no arguments binds all functions to the object');
  });

  test("memoize", function() {
    var fib = function(n) {
      return n < 2 ? n : fib(n - 1) + fib(n - 2);
    };
    var fastFib = fib.memoize();
    equal(fib(10), 55, 'a memoized version of fibonacci produces identical results');
    equal(fastFib(10), 55, 'a memoized version of fibonacci produces identical results');

    var o = function(str) {
      return str;
    };
    var fastO = o.memoize();
    equal(o('toString'), 'toString', 'checks hasOwnProperty');
    equal(fastO('toString'), 'toString', 'checks hasOwnProperty');
  });

  asyncTest("delay", 2, function() {
    var delayed = false;
    (function(){ delayed = true; }).delay(100);
    setTimeout(function(){ ok(!delayed, "didn't delay the function quite yet"); }, 50);
    setTimeout(function(){ ok(delayed, 'delayed the function'); start(); }, 150);
  });

  asyncTest("defer", 1, function() {
    var deferred = false;
    (function(bool){ deferred = bool; }).defer(true);
    (function(){ ok(deferred, "deferred the function"); start(); }).delay(50);
  });

  asyncTest("throttle", 2, function() {
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = incr.throttle(32);
    throttledIncr(); throttledIncr();

    equal(counter, 1, "incr was called immediately");
    (function(){ equal(counter, 2, "incr was throttled"); start(); }).delay(64);
  });

  asyncTest("throttle arguments", 2, function() {
    var value = 0;
    var update = function(val){ value = val; };
    var throttledUpdate = update.throttle(32);
    throttledUpdate(1); throttledUpdate(2);
    (function(){ throttledUpdate(3); }).delay(64);
    equal(value, 1, "updated to latest value");
    (function(){ equal(value, 3, "updated to latest value"); start(); }).delay(96);
  });

  asyncTest("throttle once", 2, function() {
    var counter = 0;
    var incr = function(){ return ++counter; };
    var throttledIncr = incr.throttle(32);
    var result = throttledIncr();
    (function(){
      equal(result, 1, "throttled functions return their value");
      equal(counter, 1, "incr was called once"); start();
    }).delay(64);
  });

  asyncTest("throttle twice", 1, function() {
    var counter = 0;
    var incr = function(){ counter++; };
    var throttledIncr = incr.throttle(32);
    throttledIncr(); throttledIncr();
    (function(){ equal(counter, 2, "incr was called twice"); start(); }).delay(64);
  });

  asyncTest("throttle repeatedly with results", 6, function() {
    var counter = 0;
    var incr = function(){ return ++counter; };
    var throttledIncr = incr.throttle(64);
    var results = [];
    var saveResult = function() { results.push(throttledIncr()); };
    saveResult(); saveResult();
    saveResult.delay(32);
    saveResult.delay(80);
    saveResult.delay(96);
    saveResult.delay(144);
    (function() {
      equal(results[0], 1, "incr was called once");
      equal(results[1], 1, "incr was throttled");
      equal(results[2], 1, "incr was throttled");
      equal(results[3], 2, "incr was called twice");
      equal(results[4], 2, "incr was throttled");
      equal(results[5], 3, "incr was called trailing");
      start();
    }).delay(192);
  });

  asyncTest("throttle triggers trailing call when invoked repeatedly", 2, function() {
    var counter = 0;
    var limit = 48;
    var incr = function(){ counter++; };
    var throttledIncr = incr.throttle(32);

    var stamp = new Date;
    while ((new Date - stamp) < limit) {
      throttledIncr();
    }
    var lastCount = counter;
    ok(counter > 1);

    (function() {
      ok(counter > lastCount);
      start();
    }).delay(96);
  });

  asyncTest("debounce", 1, function() {
    var counter = 0;
    var incr = function(){ counter++; };
    var debouncedIncr = incr.debounce(32);
    debouncedIncr(); debouncedIncr();
    debouncedIncr.delay(16);
    (function(){ equal(counter, 1, "incr was debounced"); start(); }).delay(96);
  });

  asyncTest("debounce asap", 4, function() {
    var a, b;
    var counter = 0;
    var incr = function(){ return ++counter; };
    var debouncedIncr = incr.debounce(64, true);
    a = debouncedIncr();
    b = debouncedIncr();
    equal(a, 1);
    equal(b, 1);
    equal(counter, 1, 'incr was called immediately');
    debouncedIncr.delay(16);
    debouncedIncr.delay(32);
    debouncedIncr.delay(48);
    (function(){ equal(counter, 1, "incr was debounced"); start(); }).delay(128);
  });

  asyncTest("debounce asap recursively", 2, function() {
    var counter = 0;
    var debouncedIncr = function(){
      counter++;
      if (counter < 10) debouncedIncr();
    }.debounce(32, true);
    debouncedIncr();
    equal(counter, 1, "incr was called immediately");
    (function(){ equal(counter, 1, "incr was debounced"); start(); }).delay(96);
  });

  test("once", function() {
    var num = 0;
    var increment = (function(){ num++; }).once();
    increment();
    increment();
    equal(num, 1);
  });

  test("wrap", function() {
    var greet = function(name){ return "hi: " + name; };
    var backwards = greet.wrap(function(func, name){ return func(name) + ' ' + name.split('').reverse().join(''); });
    equal(backwards('moe'), 'hi: moe eom', 'wrapped the saluation function');

    var inner = function(){ return "Hello "; };
    var obj   = {name : "Moe"};
    obj.hi    = inner.wrap(function(fn){ return fn() + this.name; });
    equal(obj.hi(), "Hello Moe");

    var noop    = function(){};
    var wrapped = noop.wrap(function(fn){ return Array.prototype.slice.call(arguments, 0); });
    var ret     = wrapped(['whats', 'your'], 'vector', 'victor');
    deepEqual(ret, [noop, ['whats', 'your'], 'vector', 'victor']);
  });

  test("compose", function() {
    var greet = function(name){ return "hi: " + name; };
    var exclaim = function(sentence){ return sentence + '!'; };
    var composed = exclaim.compose(greet);
    equal(composed('moe'), 'hi: moe!', 'can compose a function that takes another');

    composed = greet.compose(exclaim);
    equal(composed('moe'), 'hi: moe!', 'in this case, the functions are also commutative');
  });

  test("after", function() {
    var testAfter = function(afterAmount, timesCalled) {
      var afterCalled = 0;
      var after = afterAmount.after(function() {
        afterCalled++;
      });
      while (timesCalled--) after();
      return afterCalled;
    };

    equal(testAfter(5, 5), 1, "after(N) should fire after being called N times");
    equal(testAfter(5, 4), 0, "after(N) should not fire unless called N times");
    equal(testAfter(0, 0), 1, "after(0) should fire immediately");
  });

});
