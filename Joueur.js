module.exports = function() {
	/*** CONSTANTES ***/
	var PASSPHRASE = 'asdf';
	
	/*** Joueur ***/
	Joueur = function(nom) {
		this.nom = nom;
		this.id = null;
	};

	// Associe le id au joueur
	Joueur.prototype.connecte = function(id) {
		// S'il est deja connecté
		if(this.id) {
			console.log('Joueur \'' + this.nom + '\' deja utilise.');
			return null;
		} else {
			joueur.id = id;
			console.log('(Entree) ' + this.toString());
			return this;
		}
	};
	
	Joueur.prototype.deconnecte = function() {
		this.id = null;
		console.log('(Sortie) ' + this.toString());
	};
	
	Joueur.prototype.toString = function() {
		return this.nom + ' : ' + this.id;
	}

	/*** Joueurs ***/
	Joueurs = function() {
		this.liste = [
			new Joueur('Micheline'), 
			new Joueur('Simon'), 
			new Joueur('Marie-Helene'), 
			new Joueur('Marc')];
	};

	Joueurs.prototype.getJoueurNom = function(nom) {
		for(let i=0; i < this.liste.length; ++i) {
			if(this.liste[i].nom == nom)
				return this.liste[i];
		}
		// Le joueur n'existe pas ou n'est pas connecte.
		return null;
	};
	
	Joueurs.prototype.getJoueurId = function(id) {
		for(let i=0; i < this.liste.length; ++i) {
			if(this.liste[i].id == id) {
				return this.liste[i];
			}
		}
		// Le joueur n'existe pas ou n'est pas connecte.
		return null;
	};

	Joueurs.prototype.connexionJoueur = function(id, nom, pp) {
		// console.log(id + " demande une connexion a \"" + nom + "\" avec la phrase de passe \"" + pp + "\".");
		if(pp === PASSPHRASE) {	
		
			joueur = this.getJoueurId(id);
			
			// la session utilise deja un autre joueur : on le botte
			if(joueur) {
				joueur.deconnecte();
			}
			
			joueur = this.getJoueurNom(nom);
			
			// Si le joueur existe
			if(joueur) {
				return joueur.connecte(id);
			// S'il n'existe pas
			} else {
				console.log('Connexion invalide : joueur \'' + nom + '\' inexistant.');
			}
		} else {
			console.log("Phrase de passe incorrecte.");
		}
		return null;
	};
	
	Joueurs.prototype.deconnexionJoueur = function(id) {
		joueur = this.getJoueurId(id);
		
		if(joueur) {
			joueur.deconnecte();
		}
	};
	
	Joueurs.prototype.toString = function() {
		var res = '';
		res += '-------------------------------------\n';
		res += '| Joueur    ,    id\n';
		res += '-------------------------------------\n';
		
		for(let i=0; i < this.liste.length; ++i) {
			res += '| ' + this.liste[i].nom + ', ' + this.liste[i].id + '\n';
		}
		
		res += '-------------------------------------\n';
		
		return res;
	};
};