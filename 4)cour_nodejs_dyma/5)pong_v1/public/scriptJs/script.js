//variable d init
var tmpSup;
var canvas;
var ctx;
var victoire = 3;
var canvasWidth = 1000;
var canvasHeigth = 600;
var blocksize = 20;
var delayBall = 1;
var ball;
var myRaquette;
var raquette1;
var raquette2;

//varaibel qu il faudra envoyer perpetuellement a la base de donner 
	//position x et y de la raquette adverse + 
var dificulte = 0;
var point2 = 0;
var point1 = 0;
var WichRaquette = 0;
	

function init()
{
	canvas = document.createElement('canvas');
	canvas.width = canvasWidth;
	canvas.height = canvasHeigth;
	canvas.style.border = "1px solid";
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');
	ball = new Ball();
	raquette1 = new Raquette();
	raquette2 = new Raquette();
	raquette1.init("droite");
	raquette2.init("gauche");
	raquette1.draw();
	raquette2.draw();
}	

function Ball()
{
	this.posX = canvasWidth/2;
	this.posY = canvasHeigth/2;
	this.xmouv = 1;
	this.ymouv = 1;
	this.angle = 30;
	this.radius = (blocksize)/2;
	this.draw = function()
	{
		ctx.fillStyle = "#555555";
		ctx.beginPath();
		ctx.arc(this.posX,this.posY, this.radius, 0, Math.PI*2, true);
		ctx.fill();
	}
	this.calY = function()
	{
		var tmp2 = this.ymouv; 
		var tmp = this.xmouv; 
		if ( tmp < 0)
			tmp *= -1;
		this.ymouv = Math.round(tmp * Math.tan(this.angle * Math.PI / 100));
		if (tmp2 < 0 && this.ymouv > 0)
			this.ymouv *= -1;
		this.xmouv *= -1;
	}
	this.calX = function()
	{
		var tmp2 = this.xmouv;
		var tmp = this.ymouv;
		if ( tmp < 0)
			tmp *= -1;
		this.xmouv = -1 * Math.round(tmp/Math.tan(this.angle * Math.PI / 100));
		if (tmp2 > 0 && this.xmouv < 0)
			this.xmouv *= -1;
		this.ymouv *= -1;
	}
	this.percute = function()
	{
		if (this.posX + blocksize/2>= canvasWidth)
		{
			this.calY();
			point2++;
			return (-2);
		}
		else if (this.posX - blocksize/2 <= 0)
		{
			this.calY();
			point1++;
			return (-1);
		}
		else if (this.posY + blocksize/2 >= canvasHeigth)
			this.calX();
		else if (this.posY - blocksize/2 <= 0)
			this.calX();
	}
	this.percuteRaquette = function()
	{
		var taille = raquette1.taille; 
		var body = raquette1.body;
		if (this.posY <= body[1] + taille[1] && this.posY >= body[1] && this.posX <= body[0] + taille[0] && this.posX >= body[0])
		{
			if ((this.posY - blocksize/2 <= body[1] + taille[1] && this.posY + blocksize/2 > body[1] + taille[1]) ||
			(this.posY + blocksize/2 >= body[1] + taille[1] && this.posY - blocksize/2 < body[1] + taille[1]))
				this.calX();
			else 
				this.calY();
		}
		taille = raquette2.taille; 
		body = raquette2.body;
		if (this.posY <= body[1] + taille[1] && this.posY >= body[1] && this.posX <= body[0] + taille[0] && this.posX >= body[0])
		{
			if ((this.posY - blocksize/2 <= body[1] + taille[1] && this.posY + blocksize/2 > body[1] + taille[1]) ||
			(this.posY + blocksize/2 >= body[1] + taille[1] && this.posY - blocksize/2 < body[1] + taille[1]))
				this.calX();
			else 
				this.calY();
		}		
	}
	this.advence = function()
	{
		this.posX += this.xmouv;
		this.posY += this.ymouv;
		if (this.percute() < 0)
			return (2);
		if (point1 == victoire || point2 == victoire)
			return (1);
		this.percuteRaquette();
		this.draw();
	}
	this.replay = function()
	{
		ctx.strokeStyle = "#000000";
		ctx.font = "20pt Calibri,Geneva,Arial";
		ctx.strokeText("Remise en jeux ...", canvasWidth/2 - 100 , canvasHeigth/2);
		ball.posX = canvasWidth/2;
		ball.posY = canvasHeigth/2;	
		tmpSup = 2000;
	}
	this.gameover = function()
	{
		ctx.strokeStyle = "#000000";
		ctx.font = "100pt Calibri,Geneva,Arial";
		ctx.strokeText(point2 + " | " + point1, canvasWidth/2 - 150 , canvasHeigth/2);
		return (-1);
	}
}

function Raquette()
{
	this.taille = [blocksize,blocksize * (5 - dificulte)];
	this.body = [];
	this.mouv = 0;
	this.init = function(coter)
	{
		if (coter === "droite")
			this.body[0] = canvasWidth - (blocksize * 2);
		else 
			this.body[0] = blocksize;
		this.body[1] = (canvasHeigth - this.taille[1])/2;
	}
	this.draw = function()
	{
		ctx.fillStyle = "#000000";
		ctx.fillRect(this.body[0], this.body[1], this.taille[0], this.taille[1]);
	}
	this.Rmouv = function()
	{
		if ((this.body[1] <= 0  && this.mouv == -1) || (this.body[1] + this.taille[1] >= canvasHeigth && raquette1.mouv == 1))
			this.mouv = 0;
		if (this.mouv != 0)
			this.body[1] += this.mouv;
		this.draw();
	}
}

document.onkeydown = function mouvRaquette(e)
{
	if (e.keyCode == 39)
		myRaquette.mouv = -1;	
	else if (e.keyCode == 37 )
		myRaquette.mouv = 1;	
}

document.onkeyup = function mouvRaquette(e)
{
	if (e.keyCode == 39)
		myRaquette.mouv = 0;	
	else if (e.keyCode == 37)
		myRaquette.mouv = 0;	
}

function takeInfo()
{
	ctx.clearRect(10, 10, 100, 100);
	ctx.font = "15pt Calibri,Geneva,Arial";
	ctx.strokeStyle = "#000000";
	ctx.strokeText(point2 + " | " + point1, 30 , 30);
	ctx.fillRect(canvasWidth/2, 0, 1, canvasHeigth);
}

function clearAllElement()
{
	ctx.clearRect(raquette1.body[0], raquette1.body[1], raquette1.taille[0], raquette1.taille[1]);
	ctx.clearRect(raquette2.body[0], raquette2.body[1], raquette2.taille[0], raquette2.taille[1]);
	ctx.clearRect(canvasWidth/2 -  150, canvasHeigth/2 - 150 , 300, 200);
	ctx.clearRect(ball.posX - blocksize/2, ball.posY - blocksize/2, blocksize, blocksize);
}

function refrechBall()
{
	tmpSup = 0;
	clearAllElement();
	takeInfo();
	raquette1.Rmouv();
	raquette2.Rmouv();
	var score = ball.advence();
	if (score == 1)
		return (ball.gameover());
	else if (score == 2)
		ball.replay();	
	setTimeout(refrechBall, delayBall + tmpSup);
}

window.onload = function() // function playPong()
{
	init();
	if (WichRaquette == 0)
	{
		myRaquette = raquette1;
		WichRaquette += 1;
	}
	else 
		myRaquette = raquette2;
	refrechBall();

}