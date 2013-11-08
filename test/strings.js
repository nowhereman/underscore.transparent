$(document).ready(function() {

  // Include Underscore.string methods to Underscore namespace
  // _.mixin(_.str.exports());

  module('String extensions');

  test('Strings: naturalSort', function() {
    var arr =  ['foo2', 'foo1', 'foo10', 'foo30', 'foo100', 'foo10bar'],
      sorted = ['foo1', 'foo2', 'foo10', 'foo10bar', 'foo30', 'foo100'];
    deepEqual(arr.sort(_.naturalCmp), sorted);
  });

  test('Strings: trim', function() {
    equal((123).trim(), '123', 'Non string');
    equal(' foo'.trim(), 'foo');
    equal('foo '.trim(), 'foo');
    equal(' foo '.trim(), 'foo');
    equal('    foo     '.trim(), 'foo');
    equal('    foo     '.trim(' '), 'foo', 'Manually set whitespace');
    equal('\t    foo \t  '.trim(/\s/), 'foo', 'Manually set RegExp /\\s+/');

    equal('ffoo'.trim('f'), 'oo');
    equal('ooff'.trim('f'), 'oo');
    equal('ffooff'.trim('f'), 'oo');


    equal('_-foobar-_'.trim('_-'), 'foobar');

    equal('http://foo/'.trim('/'), 'http://foo');
    equal('c:\\'.trim('\\'), 'c:');

    equal((123).trim(), '123');
    equal((123).trim(3), '12');
    equal(''.trim(), '', 'Trim empty string should return empty string');
    equal(Object.trim(null), '', 'Trim null should return empty string');
    equal(Object.trim(undefined), '', 'Trim undefined should return empty string');
  });

  test('String: levenshtein', function() {
    equal('Godfather'.levenshtein('Godfather'), 0);
    equal('Godfather'.levenshtein('Godfathe'), 1);
    equal('Godfather'.levenshtein('odfather'), 1);
    equal('Godfather'.levenshtein('Gdfthr'), 3);
    equal('seven'.levenshtein('eight'), 5);
    equal('123'.levenshtein(123), 0);
    equal((321).levenshtein('321'), 0);
    equal('lol'.levenshtein(null), 3);
    equal('lol'.levenshtein(), 3);
    equal(Object.levenshtein(null, 'lol'), 3);
    equal(Object.levenshtein(undefined, 'lol'), 3);
    equal(Object.levenshtein(), 0);
  });

  test('Strings: ltrim', function() {
    equal(' foo'.ltrim(), 'foo');
    equal('    foo'.ltrim(), 'foo');
    equal('foo '.ltrim(), 'foo ');
    equal(' foo '.ltrim(), 'foo ');
    equal(''.ltrim(), '', 'ltrim empty string should return empty string');
    equal(Object.ltrim(null), '', 'ltrim null should return empty string');
    equal(Object.ltrim(undefined), '', 'ltrim undefined should return empty string');

    equal('ffoo'.ltrim('f'), 'oo');
    equal('ooff'.ltrim('f'), 'ooff');
    equal('ffooff'.ltrim('f'), 'ooff');

    equal('_-foobar-_'.ltrim('_-'), 'foobar-_');

    equal((123).ltrim(1), '23');
  });

  test('Strings: rtrim', function() {
    equal('http://foo/'.rtrim('/'), 'http://foo', 'clean trailing slash');
    equal(' foo'.rtrim(), ' foo');
    equal('foo '.rtrim(), 'foo');
    equal('foo     '.rtrim(), 'foo');
    equal('foo  bar     '.rtrim(), 'foo  bar');
    equal(' foo '.rtrim(), ' foo');

    equal('ffoo'.rtrim('f'), 'ffoo');
    equal('ooff'.rtrim('f'), 'oo');
    equal('ffooff'.rtrim('f'), 'ffoo');

    equal('_-foobar-_'.rtrim('_-'), '_-foobar');

    equal((123).rtrim(3), '12');
    equal(''.rtrim(), '', 'rtrim empty string should return empty string');
    equal(Object.rtrim(null), '', 'rtrim null should return empty string');
  });

  test('Strings: capitalize', function() {
    equal('fabio'.capitalize(), 'Fabio', 'First letter is upper case');
    equal('fabio'.capitalize(), 'Fabio', 'First letter is upper case');
    equal('FOO'.capitalize(), 'FOO', 'Other letters unchanged');
    equal((123).capitalize(), '123', 'Non string');
    equal(''.capitalize(), '', 'Capitalizing empty string returns empty string');
    equal(Object.capitalize(null), '', 'Capitalizing null returns empty string');
    equal(Object.capitalize(undefined), '', 'Capitalizing undefined returns empty string');
  });

  test('Strings: join', function() {
    equal(''.join('foo', 'bar'), 'foobar', 'basic join');
    equal(''.join(1, 'foo', 2), '1foo2', 'join numbers and strings');
    equal(' '.join('foo', 'bar'), 'foo bar', 'join with spaces');
    equal('1'.join('2', '2'), '212', 'join number strings');
    equal((1).join(2, 2), '212', 'join numbers');
    equal(''.join('foo', null), 'foo', 'join null with string returns string');
    equal(Object.join(null,'foo', 'bar'), 'foobar', 'join strings with null returns string');
    equal(' '.join('foo', 'bar'), 'foo bar', 'join object oriented');
  });

  // WARN: Need to alias Underscore.string reverse to reverseString because Underscore already have one
  test('Strings: reverseString', function() {
    equal('foo'.reverseString(), 'oof' );
    equal('foobar'.reverseString(), 'raboof' );
    equal('foo bar'.reverseString(), 'rab oof' );
    equal('saippuakauppias'.reverseString(), 'saippuakauppias' );
    equal((123).reverseString(), '321', 'Non string');
    equal((123.45).reverseString(), '54.321', 'Non string');
    equal(''.reverseString(), '', 'reversing empty string returns empty string' );
    equal(Object.reverseString(null), '', 'reversing null returns empty string' );
    equal(Object.reverseString(undefined), '', 'reversing undefined returns empty string' );
  });

  test('Strings: clean', function() {
    equal(' foo    bar   '.clean(), 'foo bar');
    equal((123).clean(), '123');
    equal(''.clean(), '', 'claning empty string returns empty string');
    equal(Object.clean(null), '', 'claning null returns empty string');
    equal(Object.clean(undefined), '', 'claning undefined returns empty string');
  });

  test('Strings: sprintf', function() {
    // Should be very tested function already.  Thanks to
    // http://www.diveintojavascript.com/projects/sprintf-for-javascript
    equal('Hello %s'.sprintf('me'), 'Hello me', 'basic');
    equal('Hello %s'.sprintf('me'), 'Hello me', 'object');
    equal('hello %s'.chain().sprintf('me').capitalize().value(), 'Hello me', 'Chaining works');
    equal('%.1f'.sprintf(1.22222), '1.2', 'round');
    equal('%.1f'.sprintf(1.17), '1.2', 'round 2');
    equal('%(id)d - %(name)s'.sprintf({id: 824, name: 'Hello World'}), '824 - Hello World', 'Named replacements work');
    equal('%(args[0].id)d - %(args[1].name)s'.sprintf({args: [{id: 824}, {name: 'Hello World'}]}), '824 - Hello World', 'Named replacements with arrays work');
  });


  test('Strings: vsprintf', function() {
    equal('Hello %s'.vsprintf(['me']), 'Hello me', 'basic');
    equal('Hello %s'.vsprintf(['me']), 'Hello me', 'object');
    equal('hello %s'.chain().vsprintf(['me']).capitalize().value(), 'Hello me', 'Chaining works');
    equal('%.1f'.vsprintf([1.22222]), '1.2', 'round');
    equal('%.1f'.vsprintf([1.17]), '1.2', 'round 2');
    equal('%(id)d - %(name)s'.vsprintf([{id: 824, name: 'Hello World'}]), '824 - Hello World', 'Named replacement works');
    equal('%(args[0].id)d - %(args[1].name)s'.vsprintf([{args: [{id: 824}, {name: 'Hello World'}]}]), '824 - Hello World', 'Named replacement with arrays works');
  });

  test('Strings: startsWith', function() {
    ok('foobar'.startsWith('foo'), 'foobar starts with foo');
    ok(!'oobar'.startsWith('foo'), 'oobar does not start with foo');
    ok((12345).startsWith(123), '12345 starts with 123');
    ok(!(2345).startsWith(123), '2345 does not start with 123');
    ok(''.startsWith(''), 'empty string starts with empty string');
    ok(Object.startsWith(null, ''), 'null starts with empty string');
    ok(!Object.startsWith(null, 'foo'), 'null starts with foo');
  });

  test('Strings: endsWith', function() {
    ok('foobar'.endsWith('bar'), 'foobar ends with bar');
    ok('foobar'.endsWith('bar'), 'foobar ends with bar');
    ok('00018-0000062.Plone.sdh264.1a7264e6912a91aa4a81b64dc5517df7b8875994.mp4'.endsWith('mp4'), 'endsWith .mp4');
    ok(!'fooba'.endsWith('bar'), 'fooba does not end with bar');
    ok((12345).endsWith(45), '12345 ends with 45');
    ok(!(12345).endsWith(6), '12345 does not end with 6');
    ok(''.endsWith(''), 'empty string ends with empty string');
    ok(Object.endsWith(null, ''), 'null ends with empty string');
    ok(!Object.endsWith(null, 'foo'), 'null ends with foo');
  });

  // WARN: Need to alias Underscore.string include and contains to includeString and containsString because Underscore already have them
  test('Strings: includeString', function() {
    ok('foobar'.includeString('bar'), 'foobar includes bar');
    ok(!'foobar'.includeString('buzz'), 'foobar does not includes buzz');
    ok((12345).includeString(34), '12345 includes 34');
    ok(!(12345).containsString(6), '12345 does not includes 6');
    ok(!''.includeString(34), 'empty string includes 34');
    ok(!Object.includeString(null, 34), 'null includes 34');
    ok(Object.includeString(null, ''), 'null includes empty string');
  });

  test('String: chop', function(){
    ok('whitespace'.chop(2).length === 5, 'output [wh, it, es, pa, ce]');
    ok('whitespace'.chop(3).length === 4, 'output [whi, tes, pac, e]');
    ok('whitespace'.chop()[0].length === 10, 'output [whitespace]');
    ok((12345).chop(1).length === 5, 'output [1, 2, 3,  4, 5]');
  });

  test('String: clean', function(){
    equal(' foo     bar   '.clean(), 'foo bar');
    equal(''.clean(), '');
    equal(Object.clean(null), '');
    equal((1).clean(), '1');
  });

  test('String: count', function(){
    equal('Hello world'.count('l'), 3);
    equal('Hello world'.count('Hello'), 1);
    equal('Hello world'.count('foo'), 0);
    equal('x.xx....x.x'.count('x'), 5);
    equal(''.count('x'), 0);
    equal(Object.count(null, 'x'), 0);
    equal(Object.count(undefined, 'x'), 0);
    equal((12345).count(1), 1);
    equal((11345).count(1), 2);
  });

  test('String: insert', function(){
    equal('Hello '.insert(6, 'Jessy'), 'Hello Jessy');
    equal('Hello '.insert(100, 'Jessy'), 'Hello Jessy');
    equal(''.insert(100, 'Jessy'), 'Jessy');
    equal(Object.insert(null, 100, 'Jessy'), 'Jessy');
    equal(Object.insert(undefined, 100, 'Jessy'), 'Jessy');
    equal((12345).insert(6, 'Jessy'), '12345Jessy');
  });

  test('String: splice', function(){
    equal('https://edtsech@bitbucket.org/edtsech/underscore.strings'.splice(30, 7, 'epeli'),
           'https://edtsech@bitbucket.org/epeli/underscore.strings');
    equal((12345).splice(1, 2, 321), '132145', 'Non strings');
  });

  test('String: succ', function(){
    equal('a'.succ(), 'b');
    equal('A'.succ(), 'B');
    equal('+'.succ(), ',');
    equal((1).succ(), '2');
  });

  test('String: titleize', function(){
    equal('the titleize string method'.titleize(), 'The Titleize String Method');
    equal('the titleize string  method'.titleize(), 'The Titleize String  Method');
    equal(''.titleize(), '', 'Titleize empty string returns empty string');
    equal(Object.titleize(null), '', 'Titleize null returns empty string');
    equal(Object.titleize(undefined), '', 'Titleize undefined returns empty string');
    equal('let\'s have some fun'.titleize(), 'Let\'s Have Some Fun');
    equal('a-dash-separated-string'.titleize(), 'A-Dash-Separated-String');
    equal('A-DASH-SEPARATED-STRING'.titleize(), 'A-Dash-Separated-String');
    equal((123).titleize(), '123');
  });

  test('String: camelize', function(){
    equal('the_camelize_string_method'.camelize(), 'theCamelizeStringMethod');
    equal('-the-camelize-string-method'.camelize(), 'TheCamelizeStringMethod');
    equal('the camelize string method'.camelize(), 'theCamelizeStringMethod');
    equal(' the camelize  string method'.camelize(), 'theCamelizeStringMethod');
    equal('the camelize   string method'.camelize(), 'theCamelizeStringMethod');
    equal(''.camelize(), '', 'Camelize empty string returns empty string');
    equal(Object.camelize(null), '', 'Camelize null returns empty string');
    equal(Object.camelize(undefined), '', 'Camelize undefined returns empty string');
    equal((123).camelize(), '123');
  });

  test('String: underscored', function(){
    equal('the-underscored-string-method'.underscored(), 'the_underscored_string_method');
    equal('theUnderscoredStringMethod'.underscored(), 'the_underscored_string_method');
    equal('TheUnderscoredStringMethod'.underscored(), 'the_underscored_string_method');
    equal(' the underscored  string method'.underscored(), 'the_underscored_string_method');
    equal(''.underscored(), '');
    equal(Object.underscored(null), '');
    equal(Object.underscored(undefined), '');
    equal((123).underscored(), '123');
  });

  test('String: dasherize', function(){
    equal('the_dasherize_string_method'.dasherize(), 'the-dasherize-string-method');
    equal('TheDasherizeStringMethod'.dasherize(), '-the-dasherize-string-method');
    equal('thisIsATest'.dasherize(), 'this-is-a-test');
    equal('this Is A Test'.dasherize(), 'this-is-a-test');
    equal('thisIsATest123'.dasherize(), 'this-is-a-test123');
    equal('123thisIsATest'.dasherize(), '123this-is-a-test');
    equal('the dasherize string method'.dasherize(), 'the-dasherize-string-method');
    equal('the  dasherize string method  '.dasherize(), 'the-dasherize-string-method');
    equal('téléphone'.dasherize(), 'téléphone');
    equal('foo$bar'.dasherize(), 'foo$bar');
    equal(''.dasherize(), '');
    equal(Object.dasherize(null), '');
    equal(Object.dasherize(undefined), '');
    equal((123).dasherize(), '123');
  });

  test('String: camelize', function(){
    equal('-moz-transform'.camelize(), 'MozTransform');
    equal('webkit-transform'.camelize(), 'webkitTransform');
    equal('under_scored'.camelize(), 'underScored');
    equal(' with   spaces'.camelize(), 'withSpaces');
    equal(''.camelize(), '');
    equal(Object.camelize(null), '');
    equal(Object.camelize(undefined), '');
    equal("_som eWeird---name-".camelize(), 'SomEWeirdName');
  });

  test('String: join', function(){
    equal((1).join(2, 3, 4), '21314');
    equal('|'.join('foo', 'bar', 'baz'), 'foo|bar|baz');
    equal(''.join(2,3,null), '23');
    equal(Object.join(null,2,3), '23');
  });

  test('String: classify', function(){
    equal((1).classify(), '1');
    equal('some_class_name'.classify(), 'SomeClassName');
    equal('my wonderfull class_name'.classify(), 'MyWonderfullClassName');
    equal('my wonderfull.class.name'.classify(), 'MyWonderfullClassName');
  });

  test('String: humanize', function(){
    equal('the_humanize_string_method'.humanize(), 'The humanize string method');
    equal('ThehumanizeStringMethod'.humanize(), 'Thehumanize string method');
    equal('the humanize string method'.humanize(), 'The humanize string method');
    equal('the humanize_id string method_id'.humanize(), 'The humanize id string method');
    equal('the  humanize string method  '.humanize(), 'The humanize string method');
    equal('   capitalize dash-CamelCase_underscore trim  '.humanize(), 'Capitalize dash camel case underscore trim');
    equal((123).humanize(), '123');
    equal(''.humanize(), '');
    equal(Object.humanize(null), '');
    equal(Object.humanize(undefined), '');
  });

  test('String: truncate', function(){
    equal('Hello world'.truncate(6, 'read more'), 'Hello read more');
    equal('Hello world'.truncate(5), 'Hello...');
    equal('Hello'.truncate(10), 'Hello');
    equal(''.truncate(10), '');
    equal(Object.truncate(null, 10), '');
    equal(Object.truncate(undefined, 10), '');
    equal((1234567890).truncate(5), '12345...');
  });

  test('String: prune', function(){
    equal('Hello, cruel world'.prune(6, ' read more'), 'Hello read more');
    equal('Hello, world'.prune(5, 'read a lot more'), 'Hello, world');
    equal('Hello, world'.prune(5), 'Hello...');
    equal('Hello, world'.prune(8), 'Hello...');
    equal('Hello, cruel world'.prune(15), 'Hello, cruel...');
    equal('Hello world'.prune(22), 'Hello world');
    equal('Привет, жестокий мир'.prune(6, ' read more'), 'Привет read more');
    equal('Привет, мир'.prune(6, 'read a lot more'), 'Привет, мир');
    equal('Привет, мир'.prune(6), 'Привет...');
    equal('Привет, мир'.prune(8), 'Привет...');
    equal('Привет, жестокий мир'.prune(16), 'Привет, жестокий...');
    equal('Привет, мир'.prune(22), 'Привет, мир');
    equal('alksjd!!!!!!....'.prune(100, ''), 'alksjd!!!!!!....');
    equal((123).prune(10), '123');
    equal((123).prune(1, 321), '321');
    equal(''.prune(5), '');
    equal(Object.prune(null, 5), '');
    equal(Object.prune(undefined, 5), '');
  });

  test('String: isBlank', function(){
    ok(''.isBlank());
    ok(' '.isBlank());
    ok('\n'.isBlank());
    ok(!'a'.isBlank());
    ok(!'0'.isBlank());
    ok(!(0).isBlank());
    ok(''.isBlank());
    ok(Object.isBlank(null));
    ok(Object.isBlank(undefined));
  });

  test('String: escapeRegExp', function(){
    equal(/hello(?=\sworld)/.source.escapeRegExp(), 'hello\\(\\?\\=\\\\sworld\\)', 'with lookahead');
    equal(/hello(?!\shell)/.source.escapeRegExp(), 'hello\\(\\?\\!\\\\shell\\)', 'with negative lookahead');
  });

  test('String: escapeHTML', function(){
    equal('<div>Blah & "blah" & \'blah\'</div>'.escapeHTML(),
             '&lt;div&gt;Blah &amp; &quot;blah&quot; &amp; &#39;blah&#39;&lt;/div&gt;');
    equal('&lt;'.escapeHTML(), '&amp;lt;');
    equal((5).escapeHTML(), '5');
    equal(''.escapeHTML(), '');
    equal(Object.escapeHTML(null), '');
    equal(Object.escapeHTML(undefined), '');
  });

  test('String: unescapeHTML', function(){
    equal('&lt;div&gt;Blah &amp; &quot;blah&quot; &amp; &apos;blah&#39;&lt;/div&gt;'.unescapeHTML(),
             '<div>Blah & "blah" & \'blah\'</div>');
    equal('&amp;lt;'.unescapeHTML(), '&lt;');
    equal('&apos;'.unescapeHTML(), '\'');
    equal('&#39;'.unescapeHTML(), '\'');
    equal('&#0039;'.unescapeHTML(), '\'');
    equal('&#x4a;'.unescapeHTML(), 'J');
    equal('&#x04A;'.unescapeHTML(), 'J');
    equal('&#X4A;'.unescapeHTML(), '&#X4A;');
    equal('&_#39;'.unescapeHTML(), '&_#39;');
    equal('&#39_;'.unescapeHTML(), '&#39_;');
    equal('&amp;#38;'.unescapeHTML(), '&#38;');
    equal('&#38;amp;'.unescapeHTML(), '&amp;');
    equal(''.unescapeHTML(), '');
    equal(Object.unescapeHTML(null), '');
    equal(Object.unescapeHTML(undefined), '');
    equal((5).unescapeHTML(), '5');
    // equal(Object.unescapeHTML(undefined), '');
  });

  test('String: words', function() {
    deepEqual('I love you!'.words(), ['I', 'love', 'you!']);
    deepEqual(' I    love   you!  '.words(), ['I', 'love', 'you!']);
    deepEqual('I_love_you!'.words('_'), ['I', 'love', 'you!']);
    deepEqual('I-love-you!'.words(/-/), ['I', 'love', 'you!']);
    deepEqual((123).words(), ['123'], '123 number has one word "123".');
    deepEqual((0).words(), ['0'], 'Zero number has one word "0".');
    deepEqual(''.words(), [], 'Empty strings has no words.');
    deepEqual('   '.words(), [], 'Blank strings has no words.');
    deepEqual(Object.words(null), [], 'null has no words.');
    deepEqual(Object.words(undefined), [], 'undefined has no words.');
  });

  test('String: chars', function() {
    equal('Hello'.chars().length, 5);
    equal((123).chars().length, 3);
    equal(''.chars().length, 0);
    equal(Object.chars(null).length, 0);
    equal(Object.chars(undefined).length, 0);
  });

  test('String: swapCase', function(){
    equal('AaBbCcDdEe'.swapCase(), 'aAbBcCdDeE');
    equal('Hello World'.swapCase(), 'hELLO wORLD');
    equal(''.swapCase(), '');
    equal(Object.swapCase(null), '');
    equal(Object.swapCase(undefined), '');
  });

  test('String: lines', function() {
    equal('Hello\nWorld'.lines().length, 2);
    equal('Hello World'.lines().length, 1);
    equal((123).lines().length, 1);
    equal(''.lines().length, 1);
    equal(Object.lines(null).length, 0);
    equal(Object.lines(undefined).length, 0);
  });

  test('String: pad', function() {
    equal('1'.pad(8), '       1');
    equal((1).pad(8), '       1');
    equal('1'.pad(8, '0'), '00000001');
    equal('1'.pad(8, '0', 'left'), '00000001');
    equal('1'.pad(8, '0', 'right'), '10000000');
    equal('1'.pad(8, '0', 'both'), '00001000');
    equal('foo'.pad(8, '0', 'both'), '000foo00');
    equal('foo'.pad(7, '0', 'both'), '00foo00');
    equal('foo'.pad(7, '!@$%dofjrofj', 'both'), '!!foo!!');
    equal(''.pad(2), '  ');
    equal(Object.pad(null, 2), '  ');
    equal(Object.pad(undefined, 2), '  ');
  });

  test('String: lpad', function() {
    equal('1'.lpad(8), '       1');
    equal((1).lpad(8), '       1');
    equal('1'.lpad(8, '0'), '00000001');
    equal('1'.lpad(8, '0', 'left'), '00000001');
    equal(''.lpad(2), '  ');
    equal(Object.lpad(null, 2), '  ');
    equal(Object.lpad(undefined, 2), '  ');
  });

  test('String: rpad', function() {
    equal('1'.rpad(8), '1       ');
    equal((1).lpad(8), '       1');
    equal('1'.rpad(8, '0'), '10000000');
    equal('foo'.rpad(8, '0'), 'foo00000');
    equal('foo'.rpad(7, '0'), 'foo0000');
    equal(''.rpad(2), '  ');
    equal(Object.rpad(null, 2), '  ');
    equal(Object.rpad(undefined, 2), '  ');
  });

  test('String: lrpad', function() {
    equal('1'.lrpad(8), '    1   ');
    equal((1).lrpad(8), '    1   ');
    equal('1'.lrpad(8, '0'), '00001000');
    equal('foo'.lrpad(8, '0'), '000foo00');
    equal('foo'.lrpad(7, '0'), '00foo00');
    equal('foo'.lrpad(7, '!@$%dofjrofj'), '!!foo!!');
    equal(''.lrpad(2), '  ');
    equal(Object.lrpad(null, 2), '  ');
    equal(Object.lrpad(undefined, 2), '  ');
  });

  test('String: toNumber', function() {
    deepEqual('not a number'.toNumber(), NaN);
    equal((0).toNumber(), 0);
    equal('0'.toNumber(), 0);
    equal('0.0'.toNumber(), 0);
    equal('0.1'.toNumber(), 0);
    equal('0.1'.toNumber(1), 0.1);
    equal('  0.1 '.toNumber(1), 0.1);
    equal('0000'.toNumber(), 0);
    equal('2.345'.toNumber(), 2);
    equal('2.345'.toNumber(NaN), 2);
    equal('2.345'.toNumber(2), 2.35);
    equal('2.344'.toNumber(2), 2.34);
    equal('2'.toNumber(2), 2.00);
    equal((2).toNumber(2), 2.00);
    equal((-2).toNumber(), -2);
    equal('-2'.toNumber(), -2);
    equal(''.toNumber(), 0);
    equal(Object.toNumber(null), 0);
    equal(Object.toNumber(undefined), 0);
  });

  test('String: numberFormat', function() {
    equal((9000).numberFormat(), '9,000');
    equal((9000).numberFormat(0), '9,000');
    equal((9000).numberFormat(0, '', ''), '9000');
    equal((90000).numberFormat(2), '90,000.00');
    equal((1000.754).numberFormat(), '1,001');
    equal((1000.754).numberFormat(2), '1,000.75');
    equal((1000.754).numberFormat(0, ',', '.'), '1.001');
    equal((1000.754).numberFormat(2, ',', '.'), '1.000,75');
    equal((1000000.754).numberFormat(2, ',', '.'), '1.000.000,75');
    equal((1000000000).numberFormat(), '1,000,000,000');
    equal((100000000).numberFormat(), '100,000,000');
    equal('not number'.numberFormat(), '');
    equal(Object.numberFormat(), '');
    equal(Object.numberFormat(null, '.', ','), '');
    equal(Object.numberFormat(undefined, '.', ','), '');
    equal((new Number(5000)).numberFormat(), '5,000');
  });

  test('String: strRight', function() {
    equal('This_is_a_test_string'.strRight('_'), 'is_a_test_string');
    equal('This_is_a_test_string'.strRight('string'), '');
    equal('This_is_a_test_string'.strRight(), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strRight(''), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strRight('-'), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strRight(''), 'This_is_a_test_string');
    equal(''.strRight('foo'), '');
    equal(Object.strRight(null, 'foo'), '');
    equal(Object.strRight(undefined, 'foo'), '');
    equal((12345).strRight(2), '345');
  });

  test('String: strRightBack', function() {
    equal('This_is_a_test_string'.strRightBack('_'), 'string');
    equal('This_is_a_test_string'.strRightBack('string'), '');
    equal('This_is_a_test_string'.strRightBack(), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strRightBack(''), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strRightBack('-'), 'This_is_a_test_string');
    equal(''.strRightBack('foo'), '');
    equal(Object.strRightBack(null, 'foo'), '');
    equal(Object.strRightBack(undefined, 'foo'), '');
    equal((12345).strRightBack(2), '345');
  });

  test('String: strLeft', function() {
    equal('This_is_a_test_string'.strLeft('_'), 'This');
    equal('This_is_a_test_string'.strLeft('This'), '');
    equal('This_is_a_test_string'.strLeft(), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strLeft(''), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strLeft('-'), 'This_is_a_test_string');
    equal(''.strLeft('foo'), '');
    equal(Object.strLeft(null, 'foo'), '');
    equal(Object.strLeft(undefined, 'foo'), '');
    equal((123454321).strLeft(3), '12');
  });

  test('String: strLeftBack', function() {
    equal('This_is_a_test_string'.strLeftBack('_'), 'This_is_a_test');
    equal('This_is_a_test_string'.strLeftBack('This'), '');
    equal('This_is_a_test_string'.strLeftBack(), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strLeftBack(''), 'This_is_a_test_string');
    equal('This_is_a_test_string'.strLeftBack('-'), 'This_is_a_test_string');
    equal(''.strLeftBack('foo'), '');
    equal(Object.strLeftBack(null, 'foo'), '');
    equal(Object.strLeftBack(undefined, 'foo'), '');
    equal((123454321).strLeftBack(3), '123454');
  });

  test('Strings: stripTags', function() {
    equal('a <a href="#">link</a>'.stripTags(), 'a link');
    equal(('a <a href="#">link</a><script>alert("hello world!")</scr'+'ipt>').stripTags(), 'a linkalert("hello world!")');
    equal('<html><body>hello world</body></html>'.stripTags(), 'hello world');
    equal((123).stripTags(), '123');
    equal(''.stripTags(), '');
    equal(Object.stripTags(null), '');
    equal(Object.stripTags(undefined), '');
  });

  test('Strings: toSentence', function() {
    equal(['jQuery'].toSentence(), 'jQuery', 'array with a single element');
    equal(['jQuery', 'MooTools'].toSentence(), 'jQuery and MooTools', 'array with two elements');
    equal(['jQuery', 'MooTools', 'Prototype'].toSentence(), 'jQuery, MooTools and Prototype', 'array with three elements');
    equal(['jQuery', 'MooTools', 'Prototype', 'YUI'].toSentence(), 'jQuery, MooTools, Prototype and YUI', 'array with multiple elements');
    equal(['jQuery', 'MooTools', 'Prototype'].toSentence(',', ' or '), 'jQuery,MooTools or Prototype', 'handles custom separators');
  });

  test('Strings: toSentenceSerial', function (){
    equal(['jQuery'].toSentenceSerial(), 'jQuery');
    equal(['jQuery', 'MooTools'].toSentenceSerial(), 'jQuery and MooTools');
    equal(['jQuery', 'MooTools', 'Prototype'].toSentenceSerial(), 'jQuery, MooTools, and Prototype');
  });

  test('Strings: slugify', function() {
    equal('Jack & Jill like numbers 1,2,3 and 4 and silly characters ?%.$!/'.slugify(), 'jack-jill-like-numbers-123-and-4-and-silly-characters');
    equal('Un éléphant à l\'orée du bois'.slugify(), 'un-elephant-a-loree-du-bois');
    equal('I know latin characters: á í ó ú ç ã õ ñ ü ă ș ț'.slugify(), 'i-know-latin-characters-a-i-o-u-c-a-o-n-u-a-s-t');
    equal('I am a word too, even though I am but a single letter: i!'.slugify(), 'i-am-a-word-too-even-though-i-am-but-a-single-letter-i');
    equal(''.slugify(), '');
    equal(Object.slugify(null), '');
    equal(Object.slugify(undefined), '');
  });

  test('Strings: quote', function(){
    equal('foo'.quote(), '"foo"');
    //equal('"foo"'.quote(), '""foo""'); // NOTICE: Underscore.string `quote` function is buggy
    //  compared to https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/quote specifications
    //  the Underscore.string function doesn't return an evaluable string
    //  TODO: send an issue to Underscore.string GitHub repository
    equal((1).quote(), '"1"');
    equal("foo".quote("'"), "'foo'");

    // alias
    equal('foo'.q(), '"foo"');
    equal(''.q(), '""');
    equal(Object.q(null), '""');
    equal(Object.q(undefined), '""');
  });

  test('Strings: unquote', function(){
    equal('"foo"'.unquote(), 'foo');
    equal('""foo""'.unquote(), '"foo"');
    equal('"1"'.unquote(), '1');
    equal("'foo'".unquote("'"), 'foo');
  });

  test('Strings: surround', function(){
    equal('foo'.surround('ab'), 'abfooab');
    equal((1).surround('ab'), 'ab1ab');
    equal((1).surround(2), '212');
    equal('foo'.surround(1), '1foo1');
    equal(''.surround(1), '11');
    equal(Object.surround(null, 1), '11');
    equal('foo'.surround(''), 'foo');
    equal('foo'.surround(null), 'foo');
  });


  test('Strings: repeat', function() {
    equal('foo'.repeat(), '');
    equal('foo'.repeat(3), 'foofoofoo');
    equal('foo'.repeat('3'), 'foofoofoo');
    equal((123).repeat(2), '123123');
    equal((1234).repeat(2, '*'), '1234*1234');
    equal((1234).repeat(2, 5), '123451234');
    equal(''.repeat(2), '');
    equal(Object.repeat(null, 2), '');
    equal(Object.repeat(undefined, 2), '');
  });

  test('String: toBoolean', function() {
    strictEqual("false".toBoolean(), false);
    strictEqual("false".toBoolean(), false);
    strictEqual("False".toBoolean(), false);
    strictEqual("Falsy".toBoolean(null,["false", "falsy"]), false);
    strictEqual("true".toBoolean(), true);
    strictEqual("the truth".toBoolean("the truth", "this is falsy"), true);
    strictEqual("this is falsy".toBoolean("the truth", "this is falsy"), false);
    strictEqual("true".toBoolean(), true);
    strictEqual("trUe".toBoolean(), true);
    strictEqual("trUe".toBoolean(/tru?/i), true);
    strictEqual("something else".toBoolean(), undefined);
    strictEqual(function(){}.toBoolean(), true);
    strictEqual(Object.toBoolean(function(){}), true);
    strictEqual(/regexp/.toBoolean(), true);
    strictEqual("".toBoolean(), undefined);
    strictEqual((0).toBoolean(), false);
    strictEqual((1).toBoolean(), true);
    strictEqual("1".toBoolean(), true);
    strictEqual("0".toBoolean(), false);
    strictEqual((2).toBoolean(), undefined);
    strictEqual("foo true bar".toBoolean(), undefined);
    strictEqual("foo true bar".toBoolean(/true/), true);
    strictEqual("foo FALSE bar".toBoolean(null, /FALSE/), false);
    strictEqual(" true ".toBoolean(), true);
  });

});
