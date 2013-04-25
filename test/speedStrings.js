(function() {

  JSLitmus.test('levenshtein', function() {
    return [
      'pineapple'.levenshtein('potato'),
      'seven'.levenshtein('eight'),
      'the very same string'.levenshtein('the very same string'),
      'very very very long string'.levenshtein('something completely different')
    ];
  });


  JSLitmus.test('trimNoNative', function() {
    return "  foobar  ".trim(" ");
  });

  JSLitmus.test('trim', function() {
    return "  foobar  ".trim();
  });

  // NOTICE: Useless with Underscore.transparent
  JSLitmus.test('trim object-oriented', function() {
    return "  foobar  ".trim();
  });

  JSLitmus.test('trim jQuery', function() {
    return jQuery.trim("  foobar  ");
  });

  JSLitmus.test('ltrimp', function() {
    return "  foobar  ".ltrim(" ");
  });

  JSLitmus.test('rtrimp', function() {
    return "  foobar  ".rtrim(" ");
  });

  JSLitmus.test('startsWith', function() {
    return "foobar".startsWith("foo");
  });

  JSLitmus.test('endsWith', function() {
    return "foobar".endsWith("xx");
  });

  JSLitmus.test('chop', function(){
    return 'whitespace'.chop(2);
  });

  JSLitmus.test('count', function(){
    return 'Hello worls'.count('l');
  });

  JSLitmus.test('insert', function() {
    return 'Hello '.insert(6, 'world');
  });

  JSLitmus.test('splice', function() {
    return 'https://edtsech@bitbucket.org/edtsech/underscore.strings'.splice(30, 7, 'epeli');
  });

  JSLitmus.test('succ', function(){
    var let = 'a', alphabet = [];

    for (var i=0; i < 26; i++) {
        alphabet.push(let);
        let = let.succ();
    }

    return alphabet;
  });

  JSLitmus.test('titleize', function(){
    return 'the titleize string method'.titleize();
  });

  JSLitmus.test('truncate', function(){
    return 'Hello world'.truncate(5);
  });

  JSLitmus.test('prune', function(){
    return 'Hello world'.prune(5);
  });
  
  JSLitmus.test('isBlank', function(){
    return ''.isBlank();
  });

  JSLitmus.test('escapeHTML', function(){
    '<div>Blah blah blah</div>'.escapeHTML();
  });

  JSLitmus.test('unescapeHTML', function(){
    '&lt;div&gt;Blah blah blah&lt;/div&gt;'.unescapeHTML();
  });

  // NOTICE: Need to alias Underscore.string reverse to reverseString because Underscore already have one
  JSLitmus.test('reverseString', function(){
    'Hello World'.reverseString();
  });

  JSLitmus.test('pad default', function(){
    'foo'.pad(12);
  });

  JSLitmus.test('pad hash left', function(){
    'foo'.pad(12, '#');
  });

  JSLitmus.test('pad hash right', function(){
    'foo'.pad(12, '#', 'right');
  });

  JSLitmus.test('pad hash both', function(){
    'foo'.pad(12, '#', 'both');
  });

  JSLitmus.test('pad hash both longPad', function(){
    'foo'.pad(12, 'f00f00f00', 'both');
  });

  JSLitmus.test('toNumber', function(){
      '10.232323'.toNumber(2);
  });

  JSLitmus.test('strRight', function(){
    'aaa_bbb_ccc'.strRight('_');
  });

  JSLitmus.test('strRightBack', function(){
    'aaa_bbb_ccc'.strRightBack('_');
  });

  JSLitmus.test('strLeft', function(){
    'aaa_bbb_ccc'.strLeft('_');
  });

  JSLitmus.test('strLeftBack', function(){
    'aaa_bbb_ccc'.strLeftBack('_');
  });
  
  JSLitmus.test('join', function(){
    'separator'.join(1, 2, 3, 4, 5, 6, 7, 8, 'foo', 'bar', 'lol', 'wut');
  });

  JSLitmus.test('slugify', function(){
    "Un éléphant à l'orée du bois".slugify();
  });

})();
