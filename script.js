// Select Canvas
document.open();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Defined Variables

const PLAYER_HEIGHT 	= 100;
const PLAYER_WIDTH 		=	8;
const BALL_START_SPEED  = 1;
const COMPONRNT_LEV 	= .5
const BALL_DELTA_SPEED  = .1

const net ={
		x: canvas.width / 2 - 1,
		y: 0,
		width:2,
		height: 10,
		color : 'green'
}


const player = {

	x			:	1,
	y			:	canvas.height / 2 - PLAYER_HEIGHT / 2,
	width		:	PLAYER_WIDTH,
	height		:	PLAYER_HEIGHT,
	color		: "#00cc66",
	score		: 0,

}

const componet = {
	
	x		:	canvas.width - player.width - 1,
	y		:	canvas.height / 2 - PLAYER_HEIGHT / 2 ,
	width	:	PLAYER_WIDTH,
	height	:	PLAYER_HEIGHT,
	color	: 	"#cc8100",
	score	: 0,

}

const ball = {

		x				:	canvas.width / 2,
		y 			:	canvas.height / 2,
		radius	:	8,
		speed 	:	BALL_START_SPEED,
		color		:	"#ff4d4d",
		velocityX : 5,
		velocityY	:	5

}

// Draw shaps & text finction
function drawRect(x, y, w, h, color)
{
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);

}

function drawBall(x, y, r, color)
{
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, r, Math.PI * 2, false) // math.PI : meaning draw 180 * 2 // false : 3aks 3a9arib sa3a but not 
																					//matter because we're going to draw complet circle
		ctx.closePath();	
		ctx.fill();
}

function drawText(text, x, y, color)
{
	ctx.fillStyle = color;
	ctx.font = "45px fantasy";
	ctx.fillText(text, x, y)
}

function drawNet()
{
	for (let i = 0; i <= canvas.height; i += 15)
	{
		drawRect(net.x, net.y + i, net.width, net.height, net.color)
	}
}

//Draw canvas ===================> render
function render()
{
	// Clear the cenves
		drawRect(0, 0, canvas.width, canvas.height, "BLACK");
		// Draw Net
		drawNet();
		//Drawthe ball
		drawBall(ball.x, ball.y, ball.radius, ball.color)
		//Draw players
		drawRect(player.x, player.y, player.width, player.height, player.color);
		drawRect(componet.x, componet.y, componet.width, componet.height, componet.color);
		//display scors
		drawText(player.score, (canvas.width / 4.7), canvas.height / 5, "purple")
		drawText(componet.score, (canvas.width / 4.2) * 3, canvas.height / 5, "purple")
}
// check collision'

function collision(ball, player)
{
	ball.top 		= ball.y - ball.radius;
	ball.bottom 	= ball.y + ball.radius;
	ball.left		= ball.x - ball.radius;
	ball.right		= ball.x + ball.radius;

	
	player.top 		= 	player.y;
	player.bottom 	=	player.y + player.height;
	player.left		=	player.x;
	player.right	= 	player.x + player.width;

	return(
		ball.right > player.left && ball.bottom > player.top
			&& ball.left < player.right && ball.top < player.bottom
	);
}

// AI movment

function alep(a, b, t)
{
	return (a + (b - a) * t)
}
//Update pos, mov, score ...

canvas.addEventListener("mousemove", (event) =>{
	let rect = canvas.getBoundingClientRect();
	player.y = event.clientY - rect.top - player.height  / 2;
})

function resetBall()
{
	ball.x			=	canvas.width / 2,
	ball.y 			=	canvas.height / 2,
	ball.speed 		=	BALL_START_SPEED,
	ball.velocityX 	= 	5,
	ball.velocityY	=	5

}
function update()
{
			
		// document.addEventListener('keydown', (event) =>{
		// 	player.y += 1;
		// })


		ball.x += ball.velocityX * ball.speed;
		ball.y += ball.velocityY * ball.speed;

		// Wall collesions with TOP & bottom  borders
		if (ball.y - ball.radius > canvas.height || ball.y < 0)
				ball.velocityY *= -1;

		let selectPlayer = ball.x < net.x ? player : componet;
		let otherP = ball.x < net.x ? player : componet;

		if (collision(ball, selectPlayer))
		{
			ball.velocityX = - ball.velocityX
			ball.speed += BALL_DELTA_SPEED
		}
		// Component Movment (simple AI)
		let targetPos = ball.y - componet.height / 2;
		let currentPos = componet.y;

		componet.y = alep(currentPos, targetPos, COMPONRNT_LEV);
		//Update score
		if (ball.x - ball.radius < 0)
		{
			componet.score ++;
			resetBall();
		}
		if (ball.x - ball.radius > canvas.width)
		{
			player.score ++;
			resetBall();
		}


}


function game()
{
	update();
	render();
}

const FPS = 60 //frims per second

setInterval(game , 1000/ FPS)
document.close();