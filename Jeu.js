module.exports = function() {
	/*** CONSTANTES ***/
	var PASSPHRASE = 'asdf';
	var debug = true;
	
	/***************************/
	/*** Joueur ***************/
	Joueur = function(pNom, pJoueurs) {
		this.nom = pNom;
		this.id = null;
		this.joueurs = pJoueurs;
		this.main = null;
	};

	// Associe le id au joueur
	Joueur.prototype.connecte = function(id) {
		// S'il est deja connecté
		if(this.id) {
			console.log('Joueur \'' + this.nom + '\' deja utilise.');
			return null;
		} else {
			this.id = id;
			console.log('(Entree) ' + this.toString());
			return this;
		}
	};
	
	Joueur.prototype.setMain = function(pMain) {
		this.main = pMain;
		this.main.setJoueur(this);
	}
	
	Joueur.prototype.deconnecte = function() {
		this.id = null;
		console.log('(Sortie) ' + this.toString());
	};
	
	Joueur.prototype.estActif = function() {
		return this.main.estActive(this);
	}
	
	Joueur.prototype.jouerCarte = function(path) {
		if(this.estActif()) {
			var carte = this.main.getCartePath(path);
			
			if(carte) {
				this.main.jouerCarte(carte);
			}
		}
	};
	
	Joueur.prototype.toString = function() {
		return this.nom + ' : ' + this.id;
	}
	
	Joueur.prototype.genUI = function() {
		return { 
			nom: this.nom, 
			main: this.main.toHTML()
		};
	}
	
	// obj pour les autres joueurs
	Joueur.prototype.genDosUI = function() {
		var obj = this.genUI();
		
		obj.main = this.main.toHTMLDos();
		
		return obj;
	}
	
	Joueur.prototype.suivant = function() {
		return this.joueurs.joueurSuivant(this);
	}

	/***************************/
	/*** Joueurs ***************/
	Joueurs = function() {
		this.liste = [
			new Joueur('Micheline', this), 
			new Joueur('Simon', this), 
			new Joueur('Marie-Helene', this), 
			new Joueur('Marc', this)];
	};
	
	Joueurs.prototype.joueurSuivant = function(joueur) {
		var index = this.getJoueurIndex(joueur) + 1;
		
		if(index>=this.liste.length)
			index = 0;
		
		return this.liste[index];
	}
	
	Joueurs.prototype.getJoueurIndex = function(joueur) {
		for(let i=0; i < this.liste.length; ++i) {
			if(this.liste[i].nom == joueur.nom)
				return i;
		}
		// Le joueur n'existe pas ou n'est pas connecte.
		return null;
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
		
			var joueur = this.getJoueurId(id);
			
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
		var joueur = this.getJoueurId(id);
		
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
	
	/*************************/
	/*** Carte ***************/
	Carte = function(pNumero, pEnseigne) {
		if(pEnseigne) {
			this.pathImage = "cards/" + pNumero + pEnseigne + ".svg";
			this.no = pNumero;
			this.enseigne = pEnseigne;
		} else {
			this.pathImage = "cards/Joker.svg";
			this.no = "Joker";
			this.enseigne = "Joker";
		}
	};
	
	Carte.prototype.equals = function(c) {
		return (this.no === c.no && this.enseigne === c.enseigne);
	};
	
	Carte.prototype.toString = function() {
		return false;
	};
	
	Carte.prototype.toHTML = function() {
		return "<img class='card' src='" + this.pathImage + "'>";
	}
	
	Carte.prototype.toHTMLDos = function() {
		return "<img class='card' src='cards/BLUE_BACK.svg'>";
	}
	
	/**************************/
	/*** Paquet ***************/
	Paquet = function(pManche) {
		this.cartes = [];
		
		this.genererPaquet();
		this.brasser();
		this.manche = pManche;
	};
	
	Paquet.prototype.genererPaquet = function() {
		let enseignes  = ["S", "H", "D", "C"];
		let noCartes = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
		
		for(let i=0; i<enseignes.length; ++i){
			for(let j=0; j<noCartes.length; ++j) {
				this.cartes.push(new Carte(noCartes[j], enseignes[i]));
			}
		}
		
		this.cartes.push(new Carte("Joker"));
	};
	
	Paquet.prototype.brasser = function() {
		
		func = function(a, b) {  
			return 0.5 - Math.random();
		};
		
		this.cartes = this.cartes.sort(func);
	};
	
	Paquet.prototype.classer = function(atout) {

		func = function(a, b) {  
			return atout.val(b)-atout.val(a);
		};

		this.cartes = this.cartes.sort(func);
	};

	Paquet.prototype.toString = function() {
		var res = "";
		for(let i=0; i<this.cartes.length; ++i){
			res += this.cartes[i].toString() + ",";
		}
		
		return res;
	};
	
	// Séparer le paquet en 5 mains
	Paquet.prototype.donner = function() {
		let mains = [];
		let mainEnCours = 0;
		
		for(let i=0; i<5; ++i){
			mains.push(new Main(this.manche));
		}
		
		// Donne une carte à chaque joueur dans l'ordre, avec un paquet supp
		while(this.cartes.length != 0){
			mains[mainEnCours].ajouterCarte(this.cartes.pop());
			++mainEnCours;
			if(mainEnCours>=mains.length)
				mainEnCours = 0;
		}
		
		return mains;
	}
	
	/**************************/
	/*** Main ***************/
	Main = function(pManche) {
		this.cartes = [];
		this.manche = pManche;
		this.joueur = null;
	};
	
	Main.prototype.setJoueur = function(pJoueur) {
		this.joueur = pJoueur;
	}
	
	Main.prototype.ajouterCarte = function(carte) {
		this.cartes.push(carte);
	};
	
	Main.prototype.retirerCarte = function(carte) {
		for(let i=0; i<this.cartes.length; ++i){
			if(this.cartes[i].equals(carte))
				return this.cartes.splice(i,1);
		}
		
		return null;
	};
	
	Main.prototype.estActive = function() {
		console.log("Le joueur actif est : " + this.manche.joueurActif);
		return this.joueur == this.manche.joueurActif;
	}
	
	Main.prototype.jouerCarte = function(carte) {
		this.manche.leveeEnCours().nouvelleCarte(carte);
		
		return this.retirerCarte(carte);
	};
	
	Main.prototype.classer = function(atout) {

		func = function(a, b) {  
			return atout.val(b)-atout.val(a);
		};

		this.cartes = this.cartes.sort(func);
		
		return this;
	};
	
	Main.prototype.getCartePath = function(path) {
		for(let i=0; i < this.cartes.length; ++i) {
			if(this.cartes[i].pathImage == path)
				return this.cartes[i];
		}
		// Cette carte n'est pas dans la main du joueur.
		return null;
	};
	
	Main.prototype.toHTMLDos = function() {
		var res = "";
		
		for(let i=0; i<this.cartes.length; ++i) {
			res += this.cartes[i].toHTMLDos();
		}
		
		return res;
	}
	
	Main.prototype.toHTML = function() {
		var res = "";
		
		for(let i=0; i<this.cartes.length; ++i) {
			res += this.cartes[i].toHTML();
		}
		
		return res;
	}
	
	/**************************/
	/*** Levee ***************/
	Levee = function(pAtout, pDonneur, pManche) {
		this.cartes = [];
		this.atout = pAtout;
		this.joueurActif = pDonneur;
		this.manche = pManche;
	};
	
	// Ajoute une carte a une levée. Retourne vrai si la levée est complète.
	Levee.prototype.nouvelleCarte = function(pJoueur, pCarte) {
		this.cartes.push({ joueur: pJoueur, carte: pCarte });
		
		return this.verifStatut();
	};
	
	Levee.prototype.verifStatut = function() {
		if(this.cartes.length==4) {
			this.manche.LeveeTerminee();
			return true;
		} else {
			this.manche.joueurSuivant();
			return false;
		}
	}

	Levee.prototype.verifieGagnant = function() {
		return this.getJoueurCarte(this.classer()[0]);
	};
	
	Levee.prototype.getCartes = function() {
		var cartes = [];
		
		for(let i=0; i<this.cartes.length; ++i){
			cartes.push(this.cartes[i].carte);
		}
		
		return cartes;
	};

	Levee.prototype.getJoueurCarte = function(carte) {

		for(let i=0; i<this.cartes.length; ++i){
			if(this.cartes[i].carte.equals(carte))
				return this.cartes[i].joueur;
		}
		
		// Pas de joueur associé à cette carte?
		return null;
	};
	
	Levee.prototype.classer = function(atout) {
		
		var cartes = this.getCartes();
		
		func = function(a, b) {  
			return atout.val(b)-atout.val(a);
		};

		cartes.sort(func);
		
		return cartes;
	};
	
	Levee.prototype.getJoueur = function(carte) {
		for(let i=0; i<this.cartes.length; ++i){
			if(this.cartes[i].equals(carte))
				return this.cartes[i].joueur;
		}
		
		return null;
	};
	
	/**************************/
	/*** Atout ***************/
	Atout = function(pEnseigne, pNbLevees, pPts) {
		this.enseigne = pEnseigne;
		this.nbLevees = pNbLevees;
		this.pts = pPts;
		
		// Pour les bars
		this.oppos = "";
		switch(this.enseigne) {
			case "D":
				this.oppos = "H";
				break;        
			case "H":
				this.oppos = "D";
				break;        
			case "S":
				this.oppos = "C";
				break;        
			case "C":
				this.oppos = "S";
				break;
		}
	};
	
	Atout.prototype.CompareCartes = function(cartes) {
		return carte[0];
	};
	
	// Retourne la valeur absolue de la carte, selon l'atout
	Atout.prototype.val = function(c) {
		var val = 0;
		var enseignes  = ["D", "C", "H", "S"];
		var noCartes = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

		if(this.enseigne !== "Sans") {
			enseignes.splice(enseignes.lastIndexOf(this.enseigne),1)
			enseignes.push(this.enseigne);
		}

		if(c.enseigne === "Joker") {
			return 54;
		} else if(c.no === "J" && c.enseigne === this.enseigne) {
			return 53;
		} else if(c.no === "J" && c.enseigne === this.oppos) {
			return 52;
		} else {
			return enseignes.lastIndexOf(c.enseigne)*13 + noCartes.lastIndexOf(c.no);
		}
	};
	
	/**************************/
	/*** Manche ***************/
	Manche = function(pJoueurs, pDonneur) {
		this.atout = null;
		this.levees = [];
		this.mains = [];
		this.donneur = pDonneur;
		this.joueurActif = pDonneur;
		this.joueurs = pJoueurs;
		
		this.init();
	};
	
	Manche.prototype.init = function() {
		this.ChoisirAtout();
		
		do {
			var p = new Paquet(this);
			var mains = p.donner();
			
			for(let i=0; i<this.joueurs.liste.length; ++i){
				this.joueurs.liste[i].setMain(mains.pop().classer(this.atout));
			}
			
			this.ChoisirAtout();
		} while(this.atout == null);
		
		this.Jouer();
	};
	
	Manche.prototype.ChoisirAtout = function() {
		this.atout = new Atout("S", 10, 200);
	}
	
	Manche.prototype.Jouer = function() {
		if(this.levees.length < 10) {
			this.levees.push(new Levee(this.atout, this.donneur, this));
		}
	};
	
	Manche.prototype.joueurSuivant = function() {
		this.joueurActif = this.joueurActif.suivant();
	};	
	
	Manche.prototype.LeveeTerminee = function() {
		this.joueurActif = this.leveeEnCours().verifieGagnant();
		this.Jouer();
	};
	
	Manche.prototype.setJoueurActif = function(joueur) {
		this.joueurActif = joueur;
	};
	
	Manche.prototype.leveeEnCours = function() {
		return this.levees[this.levees.length-1];
	};
	
	Manche.prototype.leveesEquipe = function(noEquipe) {
		return noEquipe;
	};
	
	Manche.prototype.genUI = function(joueur) {
		return {
			atout: this.atout,
			leveesEquipeA: this.leveesEquipe(0),
			leveesEquipeA: this.leveesEquipe(1)
		};
	};
	
	Manche.prototype.updateUI = function(io) {
		for(let i=0; i<this.joueurs.liste.length; ++i) {
		if(this.joueurs.liste[i].id !== null) {
				io.to(this.joueurs.liste[i].id).emit('objUI', this.genObjUISocket(this.joueurs.liste[i].id));
			}
		}
	};
	
	Manche.prototype.genObjUISocket = function(socket) {
		// Le joueur correspondant à la demande
		var joueur = this.joueurActif.joueurs.getJoueurId(socket);
		
		if(joueur) {
			return this.genObjUI(joueur);
		}
		
		return null;
	};
	
	Manche.prototype.genObjUI = function(joueur) {
	
		console.log("Genere le UI pour " + joueur.toString());
		
		// l'objet de retour
		var obj = {};
		
		// Trouver ordre des autres joueurs
		var joueurG = joueur.suivant();
		var joueurH = joueur.suivant().suivant();
		var joueurD = joueur.suivant().suivant().suivant();
		
		if(debug === true) { 
			// Joueurs cachés, mais montrés en debug
			obj.joueurG = joueurG.genUI();
			obj.joueurH = joueurH.genUI();
			obj.joueurD = joueurD.genUI();
		} else {
			// Joueurs cachés
			obj.joueurG = joueurG.genDosUI();
			obj.joueurH = joueurH.genDosUI();
			obj.joueurD = joueurD.genDosUI();
		}
		
		// Joueur actif
		obj.joueurB = joueur.genUI();
		
		// Manche
		obj.Manche = this.genUI();
		
		return obj;
	};
	
	/**************************/
	/*** Partie ***************/
	Partie = function(joueurs) {
		this.equipes = [];
		this.manches = [];
		this.joueurs = joueurs;
		this.donneur = this.joueurs.liste[0];
	};
	
	Partie.prototype.commencerManche = function() {
		this.manches.push(new Manche(this.joueurs, this.donneur));
	};
		
	// Avance au donneur suivant avant de le retourner
	Partie.prototype.donneur = function() {
		return this.donneur.suivant();
	}
	
	Partie.prototype.jouer = function() {
		this.commencerManche(0);
	}
	
	/**************************/
	/*** Test *****************/
	test = function() {
		
		var joueurs = new Joueurs();
		var partie = new Partie(joueurs);
		
		partie.jouer();
		
		return partie;
	};

	/*************************/
};