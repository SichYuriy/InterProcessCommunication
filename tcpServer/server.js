var api = {};
global.api = api;
api.net = require('net');

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var results = [];
var taskForWorkerLength = 4;
var tempTaskIndex = 0;
var hasNextTask = true;


var server = api.net.createServer(function(socket) {
  console.log("task:" + task);
  console.log('Connected: ' + socket.localAddress);
  socket.on('data', function(data) {
    data = JSON.parse(data);
    if (data == 'ready for the next task')
    {
      if (hasNextTask)
      {
        var nextTask
        if (tempTaskIndex + taskForWorkerLength < task.length)
        {
          nextTask = task.slice(tempTaskIndex, tempTaskIndex + taskForWorkerLength);
          tempTaskIndex += taskForWorkerLength;
        } else {
          nextTask = task.slice(tempTaskIndex, task.length);
          hasNextTask = false;
        }
        socket.write(JSON.stringify(nextTask));
      }
    } else {
      for (var i = 0; i < data.length; i++) {
        results.push(data[i]);
      }
      if (results.length == task.length)
      {
        console.log("Results:" + results);
      }
    }
  });
}).listen(2000);
