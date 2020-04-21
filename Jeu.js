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
	
	// Couleur gris pale quand le joueur est actif
	Joueur.prototype.background = function() {
		if(this.estActif())
			return 'lightgray';
		return '';
	}
	
	Joueur.prototype.toString = function() {
		return this.nom + ' : ' + this.id;
	}
	
	Joueur.prototype.genUI = function() {
		if(debug === true) { 
			return { 
				nom: this.nom, 
				main: this.main.toHTML(),
				background: this.background()
			};
		} else {
			return { 
				nom: this.nom, 
				main: this.main.toHTMLDos(),
				background: this.background()
			};
		}
	}
	
	Joueur.prototype.suivant = function() {
		return this.joueurs.joueurSuivant(this);
	}
	
	Joueur.prototype.getJoueurPos = function(pos) {
		switch(pos) {
			case 'G':
				return this.suivant();
			case 'H':
				return this.suivant().suivant();
			case 'D':
				return this.suivant().suivant().suivant();
			case 'B':
				return this;
		}
	};

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
		} else if (pNumero == 'Joker') {
			this.pathImage = "cards/Joker.svg";
			this.no = "Joker";
			this.enseigne = "Joker";
		} else {
			this.pathImage = "cards/Vide.svg";
			this.no = "Vide";
			this.enseigne = "Vide";
		}
	};
	
	Carte.prototype.getEnseigne = function(atout) {
		if(this.enseigne === "Joker") {
			return atout.enseigne;
		} else if(this.no === "J" && atout.enseigne === this.oppos) {
			return atout.enseigne;
		} else {
			return this.enseigne;
		}
	};
	
	Carte.prototype.equals = function(c) {
		return (this.no === c.no && this.enseigne === c.enseigne);
	};
	
	Carte.prototype.toString = function() {
		return this.no + " de " + this.enseigne;
	};
	
	Carte.prototype.toHTML = function() {
		return "<img class='card' src='" + this.pathImage + "'>";
	}
	
	Carte.prototype.toHTMLDos = function() {
		return "<img class='card' src='cards/BLUE_BACK_500.svg'>";
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
	
	Main.prototype.contientEnseigne = function(enseigne) {
		for(let i=0; i<this.cartes.length; ++i){
			if(this.cartes[i].getEnseigne(this.manche.atout) == enseigne)
				return true;
		}
		
		return false;
	};
	
	Main.prototype.verifCarteValide = function(carte) {
		if(this.manche.leveeEnCours().atoutLevee()) {
			// Si la carte qu'on veut jouer est du bon atout, ok
			if(this.manche.leveeEnCours().atoutLevee() == carte.getEnseigne(this.manche.atout)) {
				return true;
			} else {
				// Ok si la main n'a pas de l'atout cherché
				return !this.contientEnseigne(this.manche.leveeEnCours().atoutLevee());
			}
		// Première carte, on peut jouer
		} else {
			return true;
		}
	};
	
	Main.prototype.jouerCarte = function(carte) {
		if(this.verifCarteValide(carte)) {
			this.manche.leveeEnCours().nouvelleCarte(this.joueur, carte);
			return this.retirerCarte(carte);
		}
		return null;
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
		
		console.log(this.cartes);
		
		return this.verifStatut();
	};
	
	Levee.prototype.atoutLevee = function() {
		if(this.cartes[0])
			return this.cartes[0].carte.getEnseigne(this.atout);
		
		return null;
	};
	
	Levee.prototype.atoutPresent = function() {
		
		for(let i=0; i<this.cartes.length; ++i){
			if(this.cartes[i].carte.getEnseigne(this.atout) == this.atout)
				return true;
		}
		
		// Pas d'atout joué
		return false;
	};
	
	Levee.prototype.estComplete = function() {
		return (this.cartes.length == 4);
	};
	
	Levee.prototype.verifStatut = function() {
		if(this.estComplete()) {
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
	
	Levee.prototype.getCarteJoueur = function(joueur) {
		for(let i=0; i<this.cartes.length; ++i){
			if(this.cartes[i].joueur.nom == joueur.nom)
				return this.cartes[i].carte;
		}
		
		// Pas de carte associée à ce joueur?
		return new Carte("Vide");
	};
	
	Levee.prototype.classer = function() {
		
		var cartes = this.getCartes();
		var atout = this.atout;
		
		func = function(a, b) {  
			return atout.val(b)-atout.val(a);
		};

		cartes.sort(func);
		
		return cartes;
	};
	/*
	Levee.prototype.getJoueur = function(carte) {
		for(let i=0; i<this.cartes.length; ++i){
			if(this.cartes[i].carte.equals(carte))
				return this.cartes[i].joueur;
		}
		
		return null;
	};*/
	
	Levee.prototype.toString = function() {
		var res = "La levee a " + this.cartes.length + " cartes:\n";
		for(let i=0; i<this.cartes.length; ++i){
			res += "\t" + this.cartes[i].carte + " : " + this.cartes[i].joueur;
		}
		return res;
	};
	
	// Genere le UI pour les cartes du centre selon la position du joueur
	Levee.prototype.genUI = function(joueur) {
		var obj = {
			carteH: null,
			carteB: null,
			carteD: null,
			carteG: null
		};
		
		obj.carteH = this.getCarteJoueur(joueur.getJoueurPos('H')).toHTML();
		obj.carteB = this.getCarteJoueur(joueur.getJoueurPos('B')).toHTML();
		obj.carteD = this.getCarteJoueur(joueur.getJoueurPos('D')).toHTML();
		obj.carteG = this.getCarteJoueur(joueur.getJoueurPos('G')).toHTML();
		
		return obj;
	}
	
	Levee.prototype.toStringCartes = function(cartes) {
		var res = "La levee a " + cartes.length + " cartes:\n";
		for(let i=0; i<cartes.length; ++i){
			res += "\t" + i + ": " + cartes[i].toString() + "\n";
		}
		return res;
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
	
	Manche.prototype.nouvelleLevee = function() {
		this.levees.push(new Levee(this.atout, this.donneur, this));
	}
	
	Manche.prototype.Jouer = function() {
		if(this.leveeEnCours().estComplete()) {
			if(this.levees.length < 10) {
				this.nouvelleLevee();
			}
		}
	};
	
	Manche.prototype.joueurSuivant = function() {
		this.joueurActif = this.joueurActif.suivant();
	};	
	
	Manche.prototype.LeveeTerminee = function() {
		this.joueurActif = this.leveeEnCours().verifieGagnant();
		console.log("Levee gagnee par: " + this.joueurActif);
	};
	
	Manche.prototype.setJoueurActif = function(joueur) {
		this.joueurActif = joueur;
	};
	
	Manche.prototype.leveeEnCours = function() {
		if(this.levees.length != 0) {
			return this.levees[this.levees.length-1];
		} else {
			this.nouvelleLevee();
			return this.leveeEnCours();
		}
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

		// Joueurs cachés, selon leur position
		obj.joueurG = joueur.getJoueurPos('G').genUI();
		obj.joueurH = joueur.getJoueurPos('H').genUI();
		obj.joueurD = joueur.getJoueurPos('D').genUI();
		
		// Joueur actif
		obj.joueurB = joueur.genUI();
		
		// Manche
		obj.manche = this.genUI();
		
		// Levee
		obj.levee = this.leveeEnCours().genUI(joueur);
		
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
	
	Partie.prototype.mancheEnCours = function() {
		return this.manches[this.manches.length-1];
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