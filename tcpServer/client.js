var api = {};
global.api = api;
api.net = require('net');

var socket = new api.net.Socket();
var  taskForWorker;

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, function() {
  console.log("Worker is ready to take a task");
  socket.write(JSON.stringify('ready for the next task'));
  socket.on('data', function(data) {
    console.log("Worker received " + data);
    taskForWorker = JSON.parse(data).task;
    for (var i = 0; i < taskForWorker.length; i++)
    {
      taskForWorker[i] *= 2;
    }

    setTimeout(()=>{
      console.log("Worker: task complete");
      socket.write(JSON.stringify({
        id: JSON.parse(data).id,
        task:taskForWorker
      }));
      console.log("Worker is ready to take the next task");
      socket.write(JSON.stringify('ready for the next task'));
    }, Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);

  });

});
