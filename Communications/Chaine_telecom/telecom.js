/*
Simulateur de chaîne de Transmission Numérique v1.0
@author: Frédéric BONNARDOT, AGPL-3.0-or-later license
(c) Frédéric BONNARDOT, April 2020

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

This code is given as is without warranty of any kind.
In no event shall the authors or copyright holder be liable for any claim
                                                   damages or other liability.
*/

window.addEventListener("load", run, false)

function line(ctx,x1,y1,x2,y2) {
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}

class Axe {
	constructor(ctx,x1,y1,x2,y2,marge,dataxmin,dataxmax,dataymin,dataymax) {
		this.ctx=ctx;
		this.x1=x1+marge;
		this.x2=x2-marge;
		this.y1=y1+marge;
		this.y2=y2-marge;
		this.marge=marge;
		this.dataxmin=dataxmin
		this.dataxmax=dataxmax
		this.dataymin=dataymin
		this.dataymax=dataymax
		// Calcul coeff changement de repère data vers écran
		this.kx=(x2-x1-2*marge)/(dataxmax-dataxmin);
		this.ky=-(y2-y1-2*marge)/(dataymax-dataymin);
		this.cx=-this.kx*dataxmin+x1+marge;
		this.cy=-this.ky*dataymax+y1+marge;
		
		this.nomAxeX("");
		this.nomAxeY("");
	}
	
	calcX(x) {
		return x*this.kx+this.cx;
	}

	calcY(y) {
		return y*this.ky+this.cy;
	}
	
	nomAxeX(nom) {
		this.nomX=nom;
	}

	nomAxeY(nom) {
		this.nomY=nom;
	}

	
	efface() {
		this.ctx.clearRect(this.x1-this.marge,this.y1-this.marge,this.x2+this.marge,this.y2+this.marge);
	}
	
	dessine_reperes() {
		this.efface();
		let tfleche=5;

		this.ctx.font = "12px serif";
		this.ctx.strokeStyle = "black"

		line(this.ctx,this.calcX(this.dataxmin),this.calcY(0),this.calcX(this.dataxmax),this.calcY(0));
		line(this.ctx,this.calcX(this.dataxmax),this.calcY(0),this.calcX(this.dataxmax)-tfleche,this.calcY(0)-tfleche);
		line(this.ctx,this.calcX(this.dataxmax),this.calcY(0),this.calcX(this.dataxmax)-tfleche,this.calcY(0)+tfleche);
		this.ctx.fillText(this.nomX,this.calcX(this.dataxmax)-this.ctx.measureText(this.nomX).width-tfleche*2,this.calcY(0)-tfleche);
		
		line(this.ctx,this.calcX(0),this.calcY(this.dataymin),this.calcX(0),this.calcY(this.dataymax));
		line(this.ctx,this.calcX(0),this.calcY(this.dataymax),this.calcX(0)-tfleche,this.calcY(this.dataymax)+tfleche);
		line(this.ctx,this.calcX(0),this.calcY(this.dataymax),this.calcX(0)+tfleche,this.calcY(this.dataymax)+tfleche);
		this.ctx.fillText(this.nomY,this.calcX(0)+tfleche,this.calcY(this.dataymax)+this.ctx.measureText("X").width+tfleche);
	}

	dessine_graduationx(pas,grille) {
		let tgrad=5;

		let deb=(Math.floor(this.dataxmin / pas))*pas;
		for (let coord=deb;coord<this.dataxmax;coord+=pas) {
			if (grille==true) {
				this.ctx.strokeStyle = "gray"
				if (coord!=0)
					line(this.ctx,this.calcX(coord),this.calcY(this.dataymin),this.calcX(coord),this.calcY(this.dataymax));
			}
			this.ctx.strokeStyle = "black"
			line(this.ctx,this.calcX(coord),-tgrad+this.calcY(0),this.calcX(coord),this.calcY()+tgrad);
			this.ctx.fillText(coord,this.calcX(coord),this.calcY(0)+tgrad);
		}
	}
	
	dessine_graduationy(pas,grille) {
		let tgrad=5;

		let deb=(Math.floor(this.dataymin / pas))*pas;
		for (let coord=deb;coord<this.dataymax;coord+=pas) {
			if (grille==true) {
				this.ctx.strokeStyle = "gray"
				if (coord!=0)
					line(this.ctx,this.calcX(this.dataxmin),this.calcY(coord),this.calcX(this.dataxmax),this.calcY(coord));
			}
			this.ctx.strokeStyle = "black"
			line(this.ctx,-tgrad+this.calcX(0),this.calcY(coord),tgrad+this.calcX(0),this.calcY(coord));
			this.ctx.fillText(coord,this.calcX(0)+tgrad,this.calcY(coord));
		}
	}
	
	dessine_croix(x,y,nom) {
		this.ctx.font = "12px serif";
		this.ctx.strokeStyle = "blue";
		let tcroix=5;
		
		line(this.ctx,this.calcX(x)-tcroix,this.calcY(y)-tcroix,this.calcX(x)+tcroix,this.calcY(y)+tcroix);
		line(this.ctx,this.calcX(x)-tcroix,this.calcY(y)+tcroix,this.calcX(x)+tcroix,this.calcY(y)-tcroix);
		
		this.ctx.fillText(nom,this.calcX(x)+tcroix*1.5,this.calcY(y)-tcroix*1.5);
	}
	
	dessine_verticale(x,nom) {
		this.ctx.font = "12px serif";
		this.ctx.strokeStyle = "green";
		let espace=5;
		
		line(this.ctx,this.calcX(x),this.calcY(this.dataymin),this.calcX(x),this.calcY(this.dataymax));	
		this.ctx.fillText(nom,this.calcX(x)+espace,this.calcY(this.dataymin)-espace);
	}
	
	courbe_boz(Te,y) {
		this.ctx.strokeStyle = "blue";
		let yprec=0;
		for (let index=0;index<y.length;index++) {
			line(this.ctx,this.calcX(index*Te),this.calcY(yprec),this.calcX(index*Te),this.calcY(y[index]));
			line(this.ctx,this.calcX(index*Te),this.calcY(y[index]),this.calcX((index+1)*Te),this.calcY(y[index]));
			yprec=y[index];
		}
	}
	
	courbe_bo1(Te,y) {
		this.ctx.strokeStyle = "blue";

		for (let index=0;index<y.length-1;index++) {
			line(this.ctx,this.calcX(index*Te),this.calcY(y[index]),this.calcX((index+1)*Te),this.calcY(y[index+1]));
		}
	}
}

function dessine_constellation(canvas_id,nom,val_I,val_Q) {
	let marge = 10
	let ctx     = canvas_id.getContext("2d");
	let graphe  = new Axe(ctx,0,0,canvas_id.getAttribute("width"),
							canvas_id.getAttribute("height"),marge,-1.5,1.5,-1.5,1.5);
	
	// Dessine les repères
	graphe.nomAxeX("I");
	graphe.nomAxeY("Q");
	graphe.dessine_reperes();
	
	// Dessine les points
	for (let index=0;index<val_I.length;index++)
		graphe.dessine_croix(val_I[index],val_Q[index],index.toString());
}

function dessine_diag_oeil(canvas_id,nom,ampl,mini,maxi,dt,grady,i_decision) {
	let marge = 10
	let ctx     = canvas_id.getContext("2d");
	let graphe  = new Axe(ctx,0,0,canvas_id.getAttribute("width"),
							canvas_id.getAttribute("height"),marge,0,2,mini,maxi);
	var extrait;
	
	// Dessine les repères
	graphe.nomAxeX("temps");
	graphe.nomAxeY(nom);
	graphe.dessine_reperes();
	
	// Graduations
	graphe.dessine_graduationx(1,true);
	graphe.dessine_graduationy(grady,true);
	
	// Extrait des blocs de 2 symboles
	//for (let i_symb=3;i_symb<(ampl.length/Ns)-6;i_symb++) {
	for (let i_symb=0;i_symb<(ampl.length/Ns)-1;i_symb++) {
		extrait=[];
		for (let index=0;index<2*Ns;index++)
			extrait[index]=ampl[i_symb*Ns+index];
		// Dessine les points
		graphe.courbe_bo1(dt,extrait);
	}
	
	// Indique l'instant de décision si >0
	if (i_decision>=0) {
		graphe.dessine_verticale(i_decision,"Instant de décision");
		graphe.dessine_verticale(i_decision*1.0+Ns*dt,"Instant de décision");
	}
}

function dessine_etats(canvas_id,nom,etats,mini,maxi,dt,gradx,grady,bo,i_decision) {
	let marge = 10
	let ctx     = canvas_id.getContext("2d");
	let graphe  = new Axe(ctx,0,0,canvas_id.getAttribute("width"),
							canvas_id.getAttribute("height"),marge,0,etats.length*dt,mini,maxi);
	
	// Dessine les repères
	graphe.nomAxeX("temps");
	graphe.nomAxeY(nom);
	graphe.dessine_reperes();
	
	// Graduations
	if (gradx==true)
		graphe.dessine_graduationx(1,true);
	if (grady==true)
		graphe.dessine_graduationy(1,true);
	
	// Dessine les points
	if (bo==0)
		graphe.courbe_boz(dt,etats);
	else
		graphe.courbe_bo1(dt,etats);
	
	// Indique l'instant de décision si >0
	if (i_decision>=0)
		for (let index=i_decision*1.0;index<etats.length*dt;index+=Ns*dt)
			graphe.dessine_verticale(index,"");
}

var donnees_txt; // Zone de texte où l'utilisateur indique le texte à émettre
var donnees_bit; // Zone de texte où l'on affiche les bits à émettre
var tab_bits=[]; // Tableau contenant les bits à émettre

function calculBits(){
	// Fonction qui lit le message et le convertit en bits
	donnees=donnees_txt.value;
	tab_bits=[];
	let txt=String("");
	for (let index=0;index<donnees.length;index++) {
		if (index & 1 == 1)
			txt=txt+"<b>";
		let ascii=donnees.charCodeAt(index);
		for (let indexb=0;indexb<8;indexb++) {
			tab_bits.push((ascii & 128) >> 7);
			txt=txt+(((ascii & 128)==128)?"1":"0");
			ascii<<=1;			
		}
		if (index & 1 == 1)
			txt=txt+"</b>";
	}
	
	donnees_bit.innerHTML="Données sous forme de bits : "+txt;
	
	changeConstel(); // Met à jour les calculs suivants
}

function tableau_IQ(etat,val_I,val_Q) {
	let txt_index=String("<td>Etat n°</td>");
	let txt_I 	 = String("<td>I</td>");
	let txt_Q 	 = String("<td>Q</td>");
		
	for (let index=0;index<val_I.length;index++) {
		if (etat.length==0)
			txt_index=txt_index+"<td>"+index.toString()+"</td>";
		else
			txt_index=txt_index+"<td>"+etat[index].toString()+"</td>";
		txt_I    =txt_I+"<td>"+val_I[index].toFixed(2).toString()+"</td>";
		txt_Q    =txt_Q+"<td>"+val_Q[index].toFixed(2).toString()+"</td>";
	}
	
	return "<table border=1px><tr>"+txt_index+"</tr><tr>"+txt_I+"</tr><tr>"+txt_Q+"</tr></table>";
}

var constel;    			// Liste permettant à l'utilisateur de choisir la constellation
var sel_const;  			// Element sélectionné dans la liste
const valences=[1,1,2,3,4];	// Valence pour chaque élément de la constellation
var tab_symb=[];			// Liste de n° de symboles obtenus en regroupant les bits
var tab_I=[];				// Tension sur I
var tab_Q=[];				// Tension sur Q
var txt_etats_bits;			// Permet de donner la liste des n°de symbole en bits
var txt_etats,etats2;		// Permet de donner la liste des n° de symbole en décimal
var txt_etat_const;         // Pour afficher un tableau avec les tensions pour constellation
var txt_etat_donnees;       // Pour afficher un tableau avec les tensions pour les données
var fig_etats;  			// Graphe pour afficher les états
//var fig_I,fig_Q;  			// Graphe pour I(t) et Q(t)
const tensions_I=[ [0,1],   // OOK
                   [-1,1],  // BPSK
				   [-1,-1,1,1], // QPSK
				   [-0.7,-1,0,-0.7,0,0.7,0.7,1], // 8 PSK
				   [0.33,0.33,1,1,0.33,0.33,1,1,-0.33,-0.33,-1,-1,-0.33,-0.33,-1,-1]]; // 16 QAM
				   
const tensions_Q=[ [0,0],   // OOK
                   [0,0],  // BPSK
				   [-1,1,-1,1], // QPSK
				   [-0.7,0,1,0.7,-1,-0.7,0.7,0], // 8 PSK
				   [0.33,1,0.33,1,-0.33,-1,-0.33,-1,0.33,1,0.33,1,-0.33,-1,-0.33,-1]];  // 16 QAM
var diag_const;				// Canvas pour dessiner la constellation


function changeConstel(){
	// Met à jour les variables associées à la constellation suivant la sélection
	sel_const=constel.selectedIndex;
	let valence=valences[sel_const];
	tab_symb=[];
	tab_I=[];
	tab_Q=[];
	let nbits=tab_bits.length;
	let txt=String("");
	let txt_bits=String("");
	let nsymboles=Math.floor(nbits/valence);

	for (let isymb=0;isymb<nsymboles;isymb++) {
		let symb=0;
		if (isymb & 1 == 1)
			txt_bits=txt_bits+"<b>";
		for (ibit=0;ibit<valence;ibit++) {
			symb=(symb<<1)+tab_bits[valence*isymb+ibit];
			txt_bits=txt_bits+(tab_bits[valence*isymb+ibit]==1?"1":"0");
		}
		tab_symb.push(symb);
		tab_I.push(tensions_I[sel_const][symb]);
		tab_Q.push(tensions_Q[sel_const][symb]);
		txt=txt+symb.toString()+" ";
		if (isymb & 1 == 1)
			txt_bits=txt_bits+"</b>";		
	}

	txt_etats_bits.innerHTML=(1<<valence)+" états possibles soit "+valence+" bits par symboles :"+txt_bits;
	txt_etats.innerHTML="Message sous forme d'états : "+txt;
	etats2.innerHTML="Ce que l'on devait trouver comme états : "+txt;

	dessine_constellation(diag_const,"nom",tensions_I[sel_const],tensions_Q[sel_const]);
	txt_etat_const.innerHTML=tableau_IQ([],tensions_I[sel_const],tensions_Q[sel_const]);
	txt_etat_donnees.innerHTML=tableau_IQ(tab_symb,tab_I,tab_Q);
	
	dessine_etats(fig_etats,"Etat",tab_symb,-0.5,(1<<valence)-0.5,1,false,true,0,-1);
	//dessine_etats(fig_I,"I(t)",tab_I,-1.5,1.5,1,false,true,0,-1);
	//dessine_etats(fig_Q,"Q(t)",tab_Q,-1.5,1.5,1,false,true,0,-1);
	
	changeMef();
}

let Ns=100.0;		// Durée d'un symbole en échantillons
var mef;			// Liste permettant à l'utilisateur de choisir la mise en forme
var fltMiseEnForme;	// Filtre pour la mise en forme
var fig_filtre_mef; // Figure pour afficher le filtre
var I_mef,Q_mef;    // I et Q après mise en forme
var fig_oeilI,fig_oeilQ; // Diagramme de l'oeil

function calculFltMEFAucun(Ns) {
	fltMiseEnForme=[];
	
	// Valeur pour temps négatif
	for (index=0;index<Ns;index++) {
		fltMiseEnForme.push(1.0);
	}
}

function calculFltMEFRacineNyquist(rolloff,Ns,NcoeffsSur2) {
	fltMiseEnForme=[];
	
	// Valeur pour temps négatif
	for (index=-NcoeffsSur2*1.0;index<0;index++) {
		val=(Math.sin(Math.PI*index/Ns))*Math.cos(Math.PI*rolloff*index/Ns)/(Math.PI*index/Ns)/(1-4*rolloff*rolloff*index*index/Ns/Ns);
		fltMiseEnForme.push(val);
	}
	// Valeur en 0
	fltMiseEnForme.push(1.0);
	// Symétrie pour temps positif
	for (index=0;index<NcoeffsSur2;index++)
		fltMiseEnForme.push(fltMiseEnForme[NcoeffsSur2-index-1]);
	
	// On a un filtre avec NcoeffsSur2*2+1 Coefficients
}

function appliqueMEF() {
	let tapresmef=fltMiseEnForme.length+Ns*tab_I.length;
	let decal=Math.ceil((fltMiseEnForme.length-Ns)/2);
	
	I_mef=[]
	Q_mef=[]
	
	// Initialise à 0 I_mef et Q_mef
	for (let index=0;index<Ns*tab_I.length;index++) {
		I_mef[index]=0.0;
		Q_mef[index]=0.0;
	}
	
	// Met en forme chaque symbole
	for (let i_symb=0;i_symb<tab_I.length;i_symb++)
		for (let i_tps=Math.max(-decal,-i_symb*Ns);i_tps<Math.min(fltMiseEnForme.length-decal,I_mef.length-i_symb*Ns);i_tps++) {
			I_mef[i_symb*Ns+i_tps]+=tab_I[i_symb]*fltMiseEnForme[i_tps+decal];
			Q_mef[i_symb*Ns+i_tps]+=tab_Q[i_symb]*fltMiseEnForme[i_tps+decal];
		}
}

function changeMef() {
	let forme = mef.selectedIndex;

	//let Ns=100.0;
	let Ncs2=Ns*3;
	
	switch (forme) {
		case 0 : 
			calculFltMEFAucun(Ns);
			break;
		case 1 :
			calculFltMEFRacineNyquist(0,Ns,Ncs2);
			break;
		case 2 :
			calculFltMEFRacineNyquist(0.3,Ns,Ncs2);
			break;
		case 3 :
			calculFltMEFRacineNyquist(0.6,Ns,Ncs2);
			break;
		case 4 :
			calculFltMEFRacineNyquist(0.9,Ns,Ncs2);
			break;
		case 5 :
			calculFltMEFRacineNyquist(0.9999,Ns,Ncs2);
			break;
	}
	
	appliqueMEF();

	dessine_etats(fig_filtre_mef,"Forme d'un symbole",fltMiseEnForme,-0.5,1.5,1.0/Ns,true,false,0,-1);
	dessine_etats(fig_Imef,"I(t)",I_mef,-1.5,1.5,1.0/Ns,true,false,0,-1);
	dessine_etats(fig_Qmef,"Q(t)",Q_mef,-1.5,1.5,1.0/Ns,true,false,0,-1);
	dessine_diag_oeil(fig_oeilI,"I(t)",I_mef,-1.5,1.5,1.0/Ns,Math.abs(tensions_I[1]),-1);	
	dessine_diag_oeil(fig_oeilQ,"Q(t)",Q_mef,-1.5,1.5,1.0/Ns,Math.abs(tensions_I[1]),-1);	

	modulation();
}

var fig_module;	// Figure signal modulé

function modulation () {
	var sig_module=[];
	
	for (let index=0;index<I_mef.length;index++)
		sig_module.push(I_mef[index]*Math.cos(2*Math.PI*index/Ns*3)-Q_mef[index]*Math.sin(2*Math.PI*index/Ns*3));
	
	dessine_etats(fig_module,"Signal modulé émis",sig_module,-1.5,1.5,1.0/Ns,true,false,1,-1);
	
	canalTransmission();
}

var bruit,filtrage      // Réglage de l'utilisateur
var fig_module_recu;    // Figure sur l'antenne du récepteur
var I_rec,Q_rec;		// Signal reçu

function canalTransmission () {
	let niv_bruit = bruit.value;
	let niv_filtrage = filtrage.value;
	let taur = niv_filtrage * Ns; // Tau/Te
	let sig_module_recu=[];
	
	I_rec=[];
	Q_rec=[];
	
	I_recprec=0;
	Q_recprec=0;
	
	for (let index=0;index<I_mef.length;index++) {
		I_recprec=(I_recprec*taur+I_mef[index])/(1+taur);
		Q_recprec=(Q_recprec*taur+Q_mef[index])/(1+taur);
		if (isNaN(I_recprec)==true)
			I_recprec=I_mef[index];
		if (isNaN(Q_recprec)==true)
			Q_recprec=Q_mef[index];
		I_rec.push(I_recprec+(Math.random()-0.5)*2*niv_bruit);
		Q_rec.push(Q_recprec+(Math.random()-0.5)*2*niv_bruit);
	}
		
	for (let index=0;index<I_mef.length;index++)
		sig_module_recu.push(I_rec[index]*Math.cos(2*Math.PI*index/Ns*3)-Q_rec[index]*Math.sin(2*Math.PI*index/Ns*3));
	
	dessine_etats(fig_module_recu,"Signal modulé reçu",sig_module_recu,-1.5,1.5,1.0/Ns,true,false,1,-1);


	filtre_adapte();	
}

function filtrage_ma(signal,coeffs) {
	var resultat=[];
	var cumsum;
	var aj=0;
	
	for (let index=0;index<coeffs.length;index++)
		aj+=coeffs[index];
		
	for (let index=Math.round(coeffs.length/2);index<signal.length+Math.round(coeffs.length/2);index++) {
		cumsum=0;
		for (let retard=Math.max(0,index-signal.length+1);retard<Math.min(index+1,coeffs.length);retard++)
			cumsum+=signal[index-retard]*coeffs[retard];
		resultat.push(cumsum/aj);
	}
	
	return resultat;
}

var fadapt;							// Permet à l'utilisateur d'activer ou pas le filtre
var I_adapt,Q_adapt;				// Signal reçu après filtrage adapté
var fig_Iadapt,fig_Qadapt;			// Figures associées
var fig_oeilIadapt,fig_oeilQadapt;
var instant_decision=0;

function filtre_adapte() {
	let filtrage = fadapt.selectedIndex;
	
	instant_decision=inst_decision.value;

	I_adapt=[];
	Q_adapt=[];
	if (filtrage==1) {	
		I_adapt=filtrage_ma(I_rec,fltMiseEnForme);
		Q_adapt=filtrage_ma(Q_rec,fltMiseEnForme);
	}
	else {
		I_adapt=I_rec;
		Q_adapt=Q_rec;
	}
	dessine_etats(fig_Iadapt,"I(t)",I_adapt,-1.2,1.2,1.0/Ns,true,false,0,instant_decision);
	dessine_etats(fig_Qadapt,"Q(t)",Q_adapt,-1.2,1.2,1.0/Ns,true,false,0,instant_decision);
	dessine_diag_oeil(fig_oeilIadapt,"I(t)",I_adapt,-2,2,1.0/Ns,Math.abs(tensions_I[1]),instant_decision);	
	dessine_diag_oeil(fig_oeilQadapt,"Q(t)",Q_adapt,-2,2,1.0/Ns,Math.abs(tensions_I[1]),instant_decision);
	
	priseDecision();
}

var inst_decision;						// Instant de décision
var echantillons_I,echantillons_Q;		// Echantillons aux instant de décision
var fig_echantillons;					// Figure avec les échantillons
var etats_recept;						// Etat décodés
var fig_const_rec;						// figure avec constellation signal reçu

function priseDecision () {
	echantillons_I = [];
	echantillons_Q = [];
	etats_recept = [];
	var dist=[];
	var pmin;
	let nb_etats=(1<<valences[sel_const]);
	
	for (let index=Math.round(instant_decision*Ns);index<I_adapt.length;index+=Ns) {
		echantillons_I.push(I_adapt[index]);
		echantillons_Q.push(Q_adapt[index]);
	}
	
	// Trouve l'état le plus proche
	for (let index=0;index<echantillons_I.length;index++) {
		for (let n_etat=0;n_etat<nb_etats;n_etat++)
			dist[n_etat]=Math.pow(echantillons_I[index]-tensions_I[sel_const][n_etat],2)+Math.pow(echantillons_Q[index]-tensions_Q[sel_const][n_etat],2);

		pmin=0;
		for (let n_etat=1;n_etat<nb_etats;n_etat++)
			if (dist[n_etat]<dist[pmin])
				pmin=n_etat;
				
		etats_recept.push(pmin);
	}

	dessine_constellation(fig_const_rec,"Constellation reception",echantillons_I,echantillons_Q);
	dessine_etats(fig_echantillonsI,"I",echantillons_I,-1.2,1.2,1.0,true,false,0,-1);
	dessine_etats(fig_echantillonsQ,"Q",echantillons_Q,-1.2,1.2,1.0,true,false,0,-1);
	
	tab_uiq.innerHTML="Valeures numériques et état estimé :<br>"+tableau_IQ(etats_recept,echantillons_I,echantillons_Q);
}

function run(){
	donnees_txt = document.getElementById("donnees");
	donnees_bit = document.getElementById("bits");
	donnees_txt.addEventListener("input", calculBits, false);

	constel = document.getElementById("constel");
	txt_etats = document.getElementById("etats");
	txt_etats_bits = document.getElementById("etats_bits");
	txt_etat_const = document.getElementById("etats_const");
	txt_etat_donnees = document.getElementById("etats_donnees");
	fig_etats = document.getElementById("fig_etats");
	/*fig_I = document.getElementById("fig_I");
	fig_Q = document.getElementById("fig_Q");*/
	diag_const = document.getElementById("diag_const")
	constel.addEventListener("change",changeConstel,false)
	
	mef = document.getElementById("mef");
	mef.addEventListener("change",changeMef,false);
	fig_filtre_mef = document.getElementById("fig_filtre_mef");
	fig_Imef = document.getElementById("fig_Imef");
	fig_Qmef = document.getElementById("fig_Qmef");
	fig_oeilI = document.getElementById("fig_oeilI");
	fig_oeilQ = document.getElementById("fig_oeilQ");

	fig_module = document.getElementById("fig_module");

	bruit = document.getElementById("bruit");
	filtrage = document.getElementById("filtrage");
	bruit.addEventListener("change",canalTransmission,false);
	filtrage.addEventListener("change",canalTransmission,false);
	fig_module_recu = document.getElementById("fig_module_recu");
	
	fadapt = document.getElementById("fadapt");
	fadapt.addEventListener("change",filtre_adapte,false);
	fig_Iadapt = document.getElementById("fig_Iadapt");
	fig_Qadapt = document.getElementById("fig_Qadapt");
	fig_oeilIadapt = document.getElementById("fig_oeilIadapt");
	fig_oeilQadapt = document.getElementById("fig_oeilQadapt");
	
	inst_decision = document.getElementById("inst_decision");
	inst_decision.addEventListener("change",filtre_adapte,false);
	fig_const_rec = document.getElementById("fig_const_rec");
	fig_echantillonsI = document.getElementById("fig_echantillonsI");
	fig_echantillonsQ = document.getElementById("fig_echantillonsQ");
	tab_uiq = document.getElementById("tab_uiq");
	
	etats2 = document.getElementById("etats2");
	
	calculBits();
}
