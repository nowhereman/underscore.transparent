$(document).ready(function() {

  var templateSettings;

  module("Utility", {

    setup: function() {
      templateSettings = Object.toHash(_.templateSettings).clone();
    },

    teardown: function() {
      _.templateSettings = templateSettings;
    }

  });

  test("#750 - Return _ instance.", 2, function() {
    var instance = _([]);
    ok(_(instance) === instance);
    ok(new _(instance) === instance);
  });

  test("identity", function() {
    var moe = Object.toHash({name : 'moe'});
    equal(moe.identity(), moe, 'moe is the same as his identity');
  });

  test("random", function() {
    var array = Object.range(1000);
    var min = Math.pow(2, 31);
    var max = Math.pow(2, 62);

    ok(array.every(function() {
      return Object.random(min, max) >= min;
    }), "should produce a random number greater than or equal to the minimum number");

    ok(array.some(function() {
      return Object.random(Number.MAX_VALUE) > 0;
    }), "should produce a random number when passed `Number.MAX_VALUE`");
  });

  test("uniqueId", function() {
    var ids = [], i = 0;
    while(i++ < 100) ids.push(Object.uniqueId());
    equal(ids.uniq().length, ids.length, 'can generate a globally-unique stream of ids');
  });

  test("times", function() {
    var vals = [];
    (3).times(function (i) { vals.push(i); });
    ok(Object.isEqual(vals, [0,1,2]), "is 0 indexed");
    //
    vals = [];
    (3).times(function(i) { vals.push(i); });
    ok(Object.isEqual(vals, [0,1,2]), "works as a wrapper");
    // collects return values
    ok(Object.isEqual([0, 1, 2], (3).times(function(i) { return i; })), "collects return values");
  });

  test("mixin", function() {
    Object.mixin({
      myReverse: function(string) {
        return string.split('').reverse().join('');
      }
    });
    equal(Object.myReverse('panacea'), 'aecanap', 'mixed in a function to _');
    equal('champ'.myReverse(), 'pmahc', 'mixed in a function to the OOP wrapper');
  });

  test("_.escape", function() {
    equal("Curly & Moe".escape(), "Curly &amp; Moe");
    equal("Curly &amp; Moe".escape(), "Curly &amp;amp; Moe");
    equal(Object.escape(null), '');
  });

  test("_.unescape", function() {
    var string = "Curly & Moe";
    equal("Curly &amp; Moe".unescape(), string);
    equal("Curly &amp;amp; Moe".unescape(), "Curly &amp; Moe");
    equal(Object.unescape(null), '');
    equal(string.escape().unescape(), string);
  });

  test("template", function() {
    var basicTemplate = "<%= thing %> is gettin' on my noives!".template();
    var result = basicTemplate({thing : 'This'});
    equal(result, "This is gettin' on my noives!", 'can do basic attribute interpolation');

    var sansSemicolonTemplate = "A <% this %> B".template();
    equal(sansSemicolonTemplate(), "A  B");

    var backslashTemplate = "<%= thing %> is \\ridanculous".template();
    equal(backslashTemplate({thing: 'This'}), "This is \\ridanculous");

    var escapeTemplate = '<%= a ? "checked=\\"checked\\"" : "" %>'.template();
    equal(escapeTemplate({a: true}), 'checked="checked"', 'can handle slash escapes in interpolations.');

    var fancyTemplate = "<ul><% \
      for (var key in people) { \
    %><li><%= people[key] %></li><% } %></ul>".template();
    result = fancyTemplate(Object.toHash({people : {moe : "Moe", larry : "Larry", curly : "Curly"}}));
    equal(result, "<ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>", 'can run arbitrary javascript in templates');

    var escapedCharsInJavascriptTemplate = "<ul><% numbers.split('\\n').each(function(item) { %><li><%= item %></li><% }) %></ul>".template();
    result = escapedCharsInJavascriptTemplate({numbers: "one\ntwo\nthree\nfour"});
    equal(result, "<ul><li>one</li><li>two</li><li>three</li><li>four</li></ul>", 'Can use escaped characters (e.g. \\n) in Javascript');

    var namespaceCollisionTemplate = "<%= pageCount %> <%= thumbnails[pageCount] %> <% thumbnails.each(function(p) { %><div class=\"thumbnail\" rel=\"<%= p %>\"></div><% }); %>".template();
    result = namespaceCollisionTemplate(Object.toHash({
      pageCount: 3,
      thumbnails: new Hash({
        1: "p1-thumbnail.gif",
        2: "p2-thumbnail.gif",
        3: "p3-thumbnail.gif"
      })
    }));
    equal(result, "3 p3-thumbnail.gif <div class=\"thumbnail\" rel=\"p1-thumbnail.gif\"></div><div class=\"thumbnail\" rel=\"p2-thumbnail.gif\"></div><div class=\"thumbnail\" rel=\"p3-thumbnail.gif\"></div>");

    var noInterpolateTemplate = "<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>".template();
    result = noInterpolateTemplate();
    equal(result, "<div><p>Just some text. Hey, I know this is silly but it aids consistency.</p></div>");

    var quoteTemplate = "It's its, not it's".template();
    equal(quoteTemplate({}), "It's its, not it's");

    var quoteInStatementAndBody = "<%\
      if(foo == 'bar'){ \
    %>Statement quotes and 'quotes'.<% } %>".template();
    equal(quoteInStatementAndBody({foo: "bar"}), "Statement quotes and 'quotes'.");

    var withNewlinesAndTabs = 'This\n\t\tis: <%= x %>.\n\tok.\nend.'.template();
    equal(withNewlinesAndTabs({x: 'that'}), 'This\n\t\tis: that.\n\tok.\nend.');

    var template = "<i><%- value %></i>".template();
    var result = template({value: "<script>"});
    equal(result, '<i>&lt;script&gt;</i>');

    var stooge = Object.toHash({
      name: "Moe",
      template: "I'm <%= this.name %>".template()
    });
    equal(stooge.template(), "I'm Moe");

    if (!$.browser.msie) {
      var fromHTML = $('#template').html().template();
      equal(fromHTML({data : 12345}).replace(/\s/g, ''), '<li>24690</li>');
    }

    _.templateSettings = Object.toHash({
      evaluate    : /\{\{([\s\S]+?)\}\}/g,
      interpolate : /\{\{=([\s\S]+?)\}\}/g
    });

    var custom = "<ul>{{ for (var key in people) { }}<li>{{= people[key] }}</li>{{ } }}</ul>".template();
    result = custom(Object.toHash({people : {moe : "Moe", larry : "Larry", curly : "Curly"}}));
    equal(result, "<ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>", 'can run arbitrary javascript in templates');

    var customQuote = "It's its, not it's".template();
    equal(customQuote({}), "It's its, not it's");

    var quoteInStatementAndBody = "{{ if(foo == 'bar'){ }}Statement quotes and 'quotes'.{{ } }}".template();
    equal(quoteInStatementAndBody({foo: "bar"}), "Statement quotes and 'quotes'.");

    _.templateSettings = {
      evaluate    : /<\?([\s\S]+?)\?>/g,
      interpolate : /<\?=([\s\S]+?)\?>/g
    };

    var customWithSpecialChars = "<ul><? for (var key in people) { ?><li><?= people[key] ?></li><? } ?></ul>".template();
    result = customWithSpecialChars(Object.toHash({people : {moe : "Moe", larry : "Larry", curly : "Curly"}}));
    equal(result, "<ul><li>Moe</li><li>Larry</li><li>Curly</li></ul>", 'can run arbitrary javascript in templates');

    var customWithSpecialCharsQuote = "It's its, not it's".template();
    equal(customWithSpecialCharsQuote({}), "It's its, not it's");

    var quoteInStatementAndBody = "<? if(foo == 'bar'){ ?>Statement quotes and 'quotes'.<? } ?>".template();
    equal(quoteInStatementAndBody({foo: "bar"}), "Statement quotes and 'quotes'.");

    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    var mustache = "Hello {{planet}}!".template();
    equal(mustache({planet : "World"}), "Hello World!", "can mimic mustache.js");

    var templateWithNull = "a null undefined {{planet}}".template();
    equal(templateWithNull({planet : "world"}), "a null undefined world", "can handle missing escape and evaluate settings");
  });

  test('_.template provides the generated function source, when a SyntaxError occurs', function() {
    try {
      '<b><%= if x %></b>'.template();
    } catch (ex) {
      var source = ex.source;
    }
    ok(/__p/.test(source));
  });

  test('_.template handles \\u2028 & \\u2029', function() {
    var tmpl = '<p>\u2028<%= "\\u2028\\u2029" %>\u2029</p>'.template();
    strictEqual(tmpl(), '<p>\u2028\u2028\u2029\u2029</p>');
  });

  test('result calls functions and returns primitives', function() {
    var obj = Object.toHash({w: '', x: 'x', y: function(){ return this.x; }});
    strictEqual(obj.result('w'), '');
    strictEqual(obj.result('x'), 'x');
    strictEqual(obj.result('y'), 'x');
    strictEqual(obj.result('z'), undefined);
    strictEqual(Object.result(null, 'x'), undefined);
  });

  test('_.templateSettings.variable', function() {
    var s = '<%=data.x%>';
    var data = {x: 'x'};
    strictEqual(s.template(data, {variable: 'data'}), 'x');
    _.templateSettings.variable = 'data';
    strictEqual(s.template()(data), 'x');
  });

  test('#547 - _.templateSettings is unchanged by custom settings.', function() {
    ok(!_.templateSettings.variable);
    ''.template({}, {variable: 'x'});
    ok(!_.templateSettings.variable);
  });

  test('#556 - undefined template variables.', function() {
    var template = '<%=x%>'.template();
    strictEqual(template({x: null}), '');
    strictEqual(template({x: undefined}), '');

    var templateEscaped = '<%-x%>'.template();
    strictEqual(templateEscaped({x: null}), '');
    strictEqual(templateEscaped({x: undefined}), '');

    var templateWithProperty = '<%=x.foo%>'.template();
    strictEqual(templateWithProperty({x: {} }), '');
    strictEqual(templateWithProperty({x: {} }), '');

    var templateWithPropertyEscaped = '<%-x.foo%>'.template();
    strictEqual(templateWithPropertyEscaped({x: {} }), '');
    strictEqual(templateWithPropertyEscaped({x: {} }), '');
  });

  test('interpolate evaluates code only once.', 2, function() {
    var count = 0;
    var template = '<%= f() %>'.template();
    template({f: function(){ ok(!(count++)); }});

    var countEscaped = 0;
    var templateEscaped = '<%- f() %>'.template();
    templateEscaped({f: function(){ ok(!(countEscaped++)); }});
  });

  test('#746 - _.template settings are not modified.', 1, function() {
    var settings = {};
    ''.template(null, settings);
    deepEqual(settings, {});
  });

  test('#779 - delimeters are applied to unescaped text.', 1, function() {
    var template = '<<\nx\n>>'.template(null, {evaluate: /<<(.*?)>>/g});
    strictEqual(template(), '<<\nx\n>>');
  });

});
