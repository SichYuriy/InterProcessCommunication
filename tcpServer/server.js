var api = {};
global.api = api;
api.net = require('net');

var task = [2, 17, 3, 2, 5, 7, 15, 22, 1, 14, 15, 9, 0, 11];
var results = [];
var taskForWorkerLength = 4;
var tempTaskIndex = 0;
var hasNextTask = true;
var tempTaskId = 0;
var countTasks = Math.ceil(task.length / taskForWorkerLength);
var completedTasks = 0;


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
          nextTask = {
            id: tempTaskId,
            task: task.slice(tempTaskIndex, tempTaskIndex + taskForWorkerLength)
          };
          tempTaskIndex += taskForWorkerLength;
          tempTaskId++;
        } else {
          nextTask = {
            id: tempTaskId,
            task: task.slice(tempTaskIndex, task.length)
          };
          hasNextTask = false;
        }
        socket.write(JSON.stringify(nextTask));
      }
    } else {
      console.log("Server received: " + data.id + " - " + data.task);
      results[data.id] = data.task;
      completedTasks++;
      if (completedTasks == countTasks)
      {
        results = joinResults();
        console.log("Results:" + results);
      }
    }
  });
}).listen(2000);

function joinResults() {
  var res = [];
  for (var i = 0; i < countTasks; i++) {
    results[i].forEach((x)=>{res.push(x)});
  }
  return res;
}
