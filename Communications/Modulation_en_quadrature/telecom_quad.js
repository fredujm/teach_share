/*
Modulateur - démodulateur en quadrature v1.2
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
			this.ctx.fillText(coord.toPrecision(2),this.calcX(coord),this.calcY(0)+tgrad); ///////////
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
			this.ctx.fillText(coord.toPrecision(2),this.calcX(0)+tgrad,this.calcY(coord)); ///////////////
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


/*
basic complex number arithmetic from 
http://rosettacode.org/wiki/Fast_Fourier_transform#Scala
*/
function Complex(re, im) 
{
	this.re = re;
	this.im = im || 0.0;
}
Complex.prototype.add = function(other, dst)
{
	dst.re = this.re + other.re;
	dst.im = this.im + other.im;
	return dst;
}
Complex.prototype.sub = function(other, dst)
{
	dst.re = this.re - other.re;
	dst.im = this.im - other.im;
	return dst;
}
Complex.prototype.mul = function(other, dst)
{
	//cache re in case dst === this
	var r = this.re * other.re - this.im * other.im;
	dst.im = this.re * other.im + this.im * other.re;
	dst.re = r;
	return dst;
}
Complex.prototype.cexp = function(dst)
{
	var er = Math.exp(this.re);
	dst.re = er * Math.cos(this.im);
	dst.im = er * Math.sin(this.im);
	return dst;
}
Complex.prototype.log = function()
{
	/*
	although 'It's just a matter of separating out the real and imaginary parts of jw.' is not a helpful quote
	the actual formula I found here and the rest was just fiddling / testing and comparing with correct results.
	http://cboard.cprogramming.com/c-programming/89116-how-implement-complex-exponential-functions-c.html#post637921
	*/
	if( !this.re )
		console.log(this.im.toString()+'j');
	else if( this.im < 0 )
		console.log(this.re.toString()+this.im.toString()+'j');
	else
		console.log(this.re.toString()+'+'+this.im.toString()+'j');
}


/*
complex fast fourier transform and inverse from
http://rosettacode.org/wiki/Fast_Fourier_transform#C.2B.2B
*/
function icfft(amplitudes)
{
	var N = amplitudes.length;
	var iN = 1 / N;
 
	//conjugate if imaginary part is not 0
	for(var i = 0 ; i < N; ++i)
		if(amplitudes[i] instanceof Complex)
			amplitudes[i].im = -amplitudes[i].im;
 
	//apply fourier transform
	amplitudes = cfft(amplitudes)
 
	for(var i = 0 ; i < N; ++i)
	{
		//conjugate again
		amplitudes[i].im = -amplitudes[i].im;
		//scale
		amplitudes[i].re *= iN;
		amplitudes[i].im *= iN;
	}
	return amplitudes;
}
 
function cfft(amplitudes)
{
	var N = amplitudes.length;
	if( N <= 1 )
		return amplitudes;
 
	var hN = N / 2;
	var even = [];
	var odd = [];
	even.length = hN;
	odd.length = hN;
	for(var i = 0; i < hN; ++i)
	{
		even[i] = amplitudes[i*2];
		odd[i] = amplitudes[i*2+1];
	}
	even = cfft(even);
	odd = cfft(odd);
 
	var a = -2*Math.PI;
	for(var k = 0; k < hN; ++k)
	{
		if(!(even[k] instanceof Complex))
			even[k] = new Complex(even[k], 0);
		if(!(odd[k] instanceof Complex))
			odd[k] = new Complex(odd[k], 0);
		var p = k/N;
		var t = new Complex(0, a * p);
		t.cexp(t).mul(odd[k], t);
		amplitudes[k] = even[k].add(t, odd[k]);
		amplitudes[k + hN] = even[k].sub(t, even[k]);
	}
	return amplitudes;
}
 
 


class Generateur {
	constructor(nom,copie,Tech,N) {
		this.nom=nom;
		this.copie=copie;
		this.Tech=Tech;
		this.N=N;
		
		// Accès au éléments de la page html (on utilise nom pour la phase et copie autrement)
		//   Cela permet de générer un signal où l'on change juste la phase et on recopie 
		//   les autres valeurs à partir d'un autre
		this.forme=document.getElementById("forme_"+copie);
		this.freq=document.getElementById("frequence_"+copie);
		this.amp=document.getElementById("amplitude_"+copie);
		this.offset=document.getElementById("offset_"+copie);
		this.phase=document.getElementById("phase_"+nom);

		// Réagit à une modification en appelant mise à jour
		this.forme.addEventListener("change",this.mise_a_jour.bind(this),false);
		this.freq.addEventListener("change",this.mise_a_jour.bind(this),false);
		this.amp.addEventListener("change",this.mise_a_jour.bind(this),false);
		this.offset.addEventListener("change",this.mise_a_jour.bind(this),false);
		this.phase.addEventListener("change",this.mise_a_jour.bind(this),false);
		
		// Fonction a appeler après maj
		this.callback_maj=[];

		// Met à jour les données
		this.mise_a_jour();
	}

	mise_a_jour() {
		// Récupère les valeurs saisies par l'utilisateur
		let freq=parseFloat(this.freq.value);
		let phase=parseFloat(this.phase.value);
		let amp=parseFloat(this.amp.value);
		let offset=parseFloat(this.offset.value);
		let forme=this.forme.selectedIndex;
		
		// Calcule l'amplitude du signal
		this.signal=[];

		switch(forme) {
			case 0 :
				// Zéro
				for (let index=0;index<this.N;index++)
					this.signal.push(0);
				break;

			case 1 :
				// Sinus
				for (let index=0;index<this.N;index++)
					this.signal.push(amp*Math.sin(2*Math.PI*index*this.Tech*freq+phase/180*Math.PI)+offset);
				break;

			case 2 :
				// Carré
				for (let index=0;index<this.N;index++) {
					/*if ((2*Math.PI*index*this.Tech*freq+phase/180*Math.PI) % 2*Math.PI < Math.PI)
						this.signal.push(amp);
					else
						this.signal.push(-1.*amp);*/
					let s=offset;
					for (let h=0;h<15;h++)
						s=s+amp/(2*h+1)*Math.sin(2*Math.PI*index*this.Tech*freq*(2*h+1)+(2*h+1)*phase/180*Math.PI)*4/Math.PI;
					this.signal.push(s);
				}
				break;
				
			case 3 :
				// Triangle
				for (let index=0;index<this.N;index++) {
					let s=offset;
					for (let h=0;h<10;h++)
						s=s+amp/(2*h+1)/(2*h+1)*((-1)**h)*Math.sin(2*Math.PI*index*this.Tech*freq*(2*h+1)+(2*h+1)*phase/180*Math.PI)*8/Math.PI/Math.PI;
					this.signal.push(s);
				}
				break;
				
			case 4 :
				var symb;
				var per;
				
				if (freq!=0)
					per=1/freq/this.Tech;
				else
					per=this.N;
					
				for (let index=0;index<this.N;index+=per) {
					symb=Math.random()>0.5?-1:1;
					for (let index2=index;index2<Math.min(this.N,index+per);index2++)
						this.signal.push(symb);
				}
				
				break;
		}
			
		// Appel de la fonction de callback
		if (this.callback_maj.length>0)
			for (let index=0;index<this.callback_maj.length;index++)
				this.callback_maj[index]();
	}
}


class Produit {
	constructor(nom,sig1,sig2) {
		this.nom=nom;
		this.Tech=sig1.Tech;
		this.N=sig1.N;
		this.sig1=sig1;
		this.sig2=sig2;
		
		// Demande au générateur d'appeler notre fonction de mise à jour lorsque le signal change
		this.sig1.callback_maj.push(this.mise_a_jour.bind(this));
		this.sig2.callback_maj.push(this.mise_a_jour.bind(this));
		
		// Fonction a appeler après maj
		this.callback_maj=[];

		// Met à jour les données
		this.mise_a_jour();
	}

	mise_a_jour() {
		// Calcule l'amplitude du signal
		this.signal=[];
		for (let index=0;index<this.N;index++)
			this.signal.push(this.sig1.signal[index]*this.sig2.signal[index]);
			
		// Appel de la fonction de callback
		if (this.callback_maj.length>0)
			for (let index=0;index<this.callback_maj.length;index++)
				this.callback_maj[index]();
	}
}


class Difference {
	constructor(nom,sig1,sig2) {
		this.nom=nom;
		this.Tech=sig1.Tech;
		this.N=sig1.N;
		this.sig1=sig1;
		this.sig2=sig2;
		
		// Demande au générateur d'appeler notre fonction de mise à jour lorsque le signal change
		this.sig1.callback_maj.push(this.mise_a_jour.bind(this));
		this.sig2.callback_maj.push(this.mise_a_jour.bind(this));
		
		// Fonction a appeler après maj
		this.callback_maj=[];

		// Met à jour les données
		this.mise_a_jour();
	}

	mise_a_jour() {
		// Calcule l'amplitude du signal
		this.signal=[];
		for (let index=0;index<this.N;index++)
			this.signal.push(this.sig1.signal[index]-this.sig2.signal[index]);
			
		// Appel de la fonction de callback
		if (this.callback_maj.length>0)
			for (let index=0;index<this.callback_maj.length;index++)
				this.callback_maj[index]();
	}
}


class Ope {
	constructor(nom,sig1,gene,sel_op,flt_label) {
		this.nom=nom;
		this.Tech=sig1.Tech;
		this.N=sig1.N;
		this.sig1=sig1;
		this.gene=gene;
		this.sel_op=document.getElementById(sel_op);
		this.flt=document.getElementById(flt_label);
		
		// Demande au générateur d'appeler notre fonction de mise à jour lorsque le signal change
		this.sig1.callback_maj.push(this.mise_a_jour.bind(this));
		this.sel_op.addEventListener("change",this.mise_a_jour.bind(this),false);
		this.flt.addEventListener("change",this.mise_a_jour_flt.bind(this),false);
		
		// Fonction a appeler après maj
		this.callback_maj=[];

		// Met à jour les données
		this.mise_a_jour();
	}

	mise_a_jour_flt() {
		// Si on a demandé de filtré et que l'on change la constant du filtre
		if (this.sel_op.selectedIndex==1)
			// On recalcule le signal
			this.mise_a_jour();
	}

	mise_a_jour() {
		let taur = parseFloat(this.flt.value); // Tau/Te
		
		// Calcule l'amplitude du signal suivant ce qu'à choisit l'utilisateur
		this.signal=[];
		switch (this.sel_op.selectedIndex) {
				case 0 :
					for (let index=0;index<this.N;index++)
						this.signal.push(Math.abs(this.sig1.signal[index]));
					break;
				case 1 :
					let val_prec=[];
					var ordre;
					
					for (ordre=0;ordre<4;ordre++)
						val_prec[ordre]=this.sig1.signal[0];
					
					for (let index=0;index<this.N;index++) {
						val_prec[0]=(this.sig1.signal[index]+val_prec[0]*taur)/(1.+taur);
						for (ordre=1;ordre<4;ordre++)
							val_prec[ordre]=(val_prec[ordre-1]+val_prec[ordre]*taur)/(1.+taur);;		
						
						this.signal.push(val_prec[3]);
					}
					break;				
				case 2 :
					for (let index=0;index<this.N;index++)
						this.signal.push(this.sig1.signal[index]*this.gene.signal[index]);
					break;
		}
			
		// Appel de la fonction de callback
		if (this.callback_maj.length>0)
			for (let index=0;index<this.callback_maj.length;index++)
				this.callback_maj[index]();
	}
}

class Spectre {
	constructor(nom,sig1) {
		this.nom=nom;
		this.Tech=sig1.Tech;
		this.N=sig1.N;
		this.sig1=sig1;
		
		// Demande au générateur d'appeler notre fonction de mise à jour lorsque le signal change
		this.sig1.callback_maj.push(this.mise_a_jour.bind(this));
		
		// Fonction a appeler après maj
		this.callback_maj=[];

		// Met à jour les données
		this.mise_a_jour();
	}

	mise_a_jour() {
		// Calcule le module de la FFT
		this.signal=[];
		
		// Version Welch 3 moyennes
/*		let tf1=[];
		let tf2=[];
		let tf3=[];
		for (let index=0;index<this.N/2;index++)
			tf1.push(this.sig1.signal[index]);
		for (let index=this.N/4;index<this.N*3/4;index++)
			tf2.push(this.sig1.signal[index]);
		for (let index=this.N/2;index<this.N;index++)
			tf3.push(this.sig1.signal[index]);
		tf1=cfft(tf1);	tf2=cfft(tf2);	tf3=cfft(tf3);
		for (let index=0;index<this.N/2;index++)
			this.signal.push(Math.sqrt(( tf1[index].re*tf1[index].re+tf1[index].im*tf1[index].im
									    +tf2[index].re*tf2[index].re+tf2[index].im*tf2[index].im
									    +tf3[index].re*tf3[index].re+tf3[index].im*tf3[index].im)/3.));
*/
		let tf=[];
		for (let index=0;index<this.N;index++)
			tf.push(this.sig1.signal[index]);
		tf=cfft(tf);
		for (let index=0;index<this.N;index++)
			this.signal.push(Math.sqrt(tf[index].re*tf[index].re+tf[index].im*tf[index].im));
									    	
		// Appel de la fonction de callback
		if (this.callback_maj.length>0)
			for (let index=0;index<this.callback_maj.length;index++)
				this.callback_maj[index]();
	}
}

function maxim(signal) {
	let monmax=signal[0];
	
	for (let index=1;index<signal.length;index++)
		if (monmax<signal[index])
			monmax=signal[index];
	
	return monmax;
}

function minim(signal) {
	let monmin=signal[0];
	
	for (let index=1;index<signal.length;index++)
		if (monmin>signal[index])
			monmin=signal[index];
	
	return monmin;
}


const valBaseTps=[0.1e-3,0.3e-3,1e-3,3e-3,10e-3,30e-3,100e-3,300e-3,1.];

class Oscilloscope {
	constructor(nom_fig,base_tps,nom_sig,generateur) {
		this.nom_fig=nom_fig;
		this.base=base_tps;
		this.generateur=generateur;
		this.nom_sig=nom_sig;
		
		// Demande au générateur d'appeler notre fonction de mise à jour lorsque le signal change
		this.generateur.callback_maj.push(this.mise_a_jour.bind(this));
		
		// Accès au éléments de la page html
		this.fig=document.getElementById(nom_fig);
		this.base_tps=document.getElementById(base_tps);

		// Réagit à une modification en appelant mise à jour
		this.base_tps.addEventListener("change",this.mise_a_jour.bind(this),false);

		// Met à jour les données
		this.mise_a_jour();
	}

	mise_a_jour() {
		// Dessine le signal
		let base    = valBaseTps[this.base_tps.selectedIndex];
		let ctx     = this.fig.getContext("2d");
		let signal  = this.generateur.signal;
		let marge   = 10;
		let graphe  = new Axe(ctx,0,0,this.fig.getAttribute("width"),
								this.fig.getAttribute("height"),marge,0,base,Math.min(minim(signal),-2),Math.max(maxim(signal),2));
	
		// Dessine les repères
		graphe.nomAxeX("t");
		graphe.nomAxeY(this.nom_sig);
		graphe.dessine_reperes();
		graphe.dessine_graduationx(base/10.,true);
		graphe.courbe_bo1(this.generateur.Tech,signal);
	}
}

const valEchFreq=[0,1000,2500,5000,7500,10000,25000,50000];

class ASpectre {
	constructor(nom_fig,ech_freq,nom_sig,calculateur_tf) {
		this.nom_fig=nom_fig;
		this.ech_freq=ech_freq;
		this.calculateur_tf=calculateur_tf;
		this.nom_sig=nom_sig;
		
		// Demande au générateur d'appeler notre fonction de mise à jour lorsque le signal change
		this.calculateur_tf.callback_maj.push(this.mise_a_jour.bind(this));
		
		// Accès au éléments de la page html
		this.fig=document.getElementById(nom_fig);
		this.freq_bas=document.getElementById(ech_freq+"_bas");
		this.freq_haut=document.getElementById(ech_freq+"_haut");

		// Réagit à une modification en appelant mise à jour
		this.freq_bas.addEventListener("change",this.mise_a_jour.bind(this),false);
		this.freq_haut.addEventListener("change",this.mise_a_jour.bind(this),false);

		// Met à jour les données
		this.mise_a_jour();
	}

	mise_a_jour() {
		// Dessine le signal
		let f1      = valEchFreq[this.freq_bas.selectedIndex];
		let f2      = valEchFreq[this.freq_haut.selectedIndex];
		let ctx     = this.fig.getContext("2d");
		let signal  = this.calculateur_tf.signal
		let marge   = 10
		let graphe  = new Axe(ctx,0,0,this.fig.getAttribute("width"),
								this.fig.getAttribute("height"),marge,f1,f2,0,maxim(signal)+0.01);
	
		// Dessine les repères
		graphe.nomAxeX("f");
		graphe.nomAxeY(this.nom_sig);
		graphe.dessine_reperes();
		graphe.dessine_graduationx((f2-f1)/10.,true);
		graphe.courbe_bo1(1/this.calculateur_tf.Tech/this.calculateur_tf.N,signal);
	}
}


function run(){
	let gen_x1 = new Generateur("x1","x1",1/100000.,131072/4);
	let gen_x2 = new Generateur("x2","x2",1/100000.,131072/4);
	let gen_x3 = new Generateur("x3","x3",1/100000.,131072/4);
	let gen_x4 = new Generateur("x4","x2",1/100000.,131072/4);
	let gen_x5 = new Generateur("x5","x2",1/100000.,131072/4);

	
	let prod_x1_x2 = new Produit("prod12(t)=x1(t).x2(t)",gen_x1,gen_x2);
	let prod_x3_x4 = new Produit("prod34(t)=x3(t).x4(t)",gen_x3,gen_x4);
	let module = new Difference("module(t)=prod12(t)-prod34(t)",prod_x1_x2,prod_x3_x4);


	let osc_x1 = new Oscilloscope("fig_osc_x1","duree_x1_x2","x1(t)",gen_x1);
	let osc_x2 = new Oscilloscope("fig_osc_x2","duree_x1_x2","x2(t)",gen_x2);
	let osc_x1_x2 = new Oscilloscope("fig_osc_x1_x2","duree_x1_x2","prod12(t)=x1(t).x2(t)",prod_x1_x2);

	let osc_x3 = new Oscilloscope("fig_osc_x3","duree_x1_x2","x3(t)",gen_x3);
	let osc_x4 = new Oscilloscope("fig_osc_x4","duree_x1_x2","x4(t)",gen_x4);
	let osc_x3_x4 = new Oscilloscope("fig_osc_x3_x4","duree_x1_x2","prod34(t)=x3(t).x4(t)",prod_x3_x4);

	let osc_module = new Oscilloscope("fig_osc_x1234","duree_x1_x2","module(t)=prod12(t)-prod34(t)",module);

	
	let tf_x1 = new Spectre("X1(f)",gen_x1);
	let tf_x2 = new Spectre("X2(f)",gen_x2);
	let tf_x1_x2 = new Spectre("PROD12(f)",prod_x1_x2);
	let tf_x3 = new Spectre("X1(f)",gen_x3);
	let tf_x4 = new Spectre("X2(f)",gen_x4);
	let tf_x3_x4 = new Spectre("PROD12(f)",prod_x3_x4);
	let tf_module = new Spectre("MODULE(f)",module);
	
	
	let spec_x1 = new ASpectre("fig_spec_x1","freq_spec_x","X1(f)",tf_x1);
	let spec_x2 = new ASpectre("fig_spec_x2","freq_spec_x","X2(f)",tf_x2);
	let spec_x1_x2 = new ASpectre("fig_spec_x1_x2","freq_spec_x","PROD12(f)",tf_x1_x2);
	let spec_x3 = new ASpectre("fig_spec_x3","freq_spec_x","X3(f)",tf_x3);
	let spec_x4 = new ASpectre("fig_spec_x4","freq_spec_x","X4(f)",tf_x4);
	let spec_x3_x4 = new ASpectre("fig_spec_x3_x4","freq_spec_x","PROD34(f)",tf_x3_x4);
	let spec_module = new ASpectre("fig_spec_x1234","freq_spec_x","MODULE(f)",tf_module);


	let osc_x5 = new Oscilloscope("fig_osc_x5","duree_x1_x2","x5(t)",gen_x5);


	let ope1   = new Ope("x6 (t)",module,gen_x5,"ope_1","filtre_pb");
	let ope2   = new Ope("x7 (t)",ope1,gen_x5,"ope_2","filtre_pb");
	let ope3   = new Ope("x8 (t)",ope2,gen_x5,"ope_3","filtre_pb");
	gen_x5.callback_maj.push(ope1.mise_a_jour.bind(ope1));

	let tf_x6 = new Spectre("X6(f)",ope1);
	let tf_x7 = new Spectre("X7(f)",ope2);
	let tf_x8 = new Spectre("X8(f)",ope3);

	let osc_x6 = new Oscilloscope("fig_osc_x6","duree_x678","x6(t)",ope1);
	let osc_x7 = new Oscilloscope("fig_osc_x7","duree_x678","x7(t)",ope2);
	let osc_x8 = new Oscilloscope("fig_osc_x8","duree_x678","x8(t)",ope3);


	let spec_x6 = new ASpectre("fig_spec_x6","freq_spec_x678","X6(f)",tf_x6);
	let spec_x7 = new ASpectre("fig_spec_x7","freq_spec_x678","X7(f)",tf_x7);
	let spec_x8 = new ASpectre("fig_spec_x8","freq_spec_x678","X8(f)",tf_x8);
}
