var connect = require('connect'),
  args = process.argv.slice(2),
  folder = args[0] || '/../../',
  port = args[1] || '80';
var path = require('path');

var base = path.resolve(__dirname + folder);
var server = connect();
server.use(connect.static(base));
server.use(connect.directory(base));
server.listen(port);

console.log("Server started on port %s in %s", port, folder);
