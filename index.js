var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Classes du Jeu
require('./Jeu.js')();

var joueurs = new Joueurs();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.use(express.static('cardsJS'));

io.on('connection', function(socket){
	console.log(socket.id);
  socket.on('connexion', function(msg){
	// Effectue la connexion et renvoie le joeur (ou null si la connexion a échoué)
	io.emit('joueur', joueurs.connexionJoueur(socket.id, msg.nom, msg.pp));
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
	joueurs.deconnexionJoueur(socket.id);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});