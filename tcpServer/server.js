var api = {};
global.api = api;
api.net = require('net');

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var results = [];


var server = api.net.createServer(function(socket) {

  console.log('Connected: ' + socket.localAddress);
  socket.write(JSON.stringify(task));
  socket.on('data', function(data) {
    console.log('Data received (by server) from worker ' + socket.localAddress + ' : ' + data);
  });
}).listen(2000);
