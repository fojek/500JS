var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

app.use(express.static('cardsJS'));

io.on('connection', function(socket){
	console.log(socket.id);
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
	console.log(msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});