var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Classes du Jeu
require('./Jeu.js')();

// Crée les objets nécessaires à la partie
var partie = new Partie(new Joueurs());

// Initie le jeu
partie.Jouer();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.use(express.static('cardsJS'));

io.on('connection', function(socket){
	console.log(socket.id);
  socket.on('connexion', function(msg){
	// Effectue la connexion et renvoie le joeur (ou null si la connexion a échoué)
	partie.joueurs.connexionJoueur(socket.id, msg.nom, msg.pp);
	console.log("CHU RENDU ICITTE AUSSI");
	/*io.emit('joueur', partie.joueurs.getJoueurId(socket.id));*/
	console.log("CHU RENDU ICITTE ENCORE");
	io.emit('objUI', partie.manches[partie.manches.length-1].genObjUISocket(socket.id));
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
	partie.joueurs.deconnexionJoueur(socket.id);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});