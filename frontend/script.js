// Select Canvas

let url = `ws://127.0.0.1:8000/ws/socket-server/`

const chatSocket = new WebSocket(url);

chatSocket.onopen = function(event) {
	console.log('WebSocket is open now.');
};

document.open();
let player = {}
let opponent = {}
let net = {}
let ball = {}


chatSocket.onopen = function(event)
{
	console.log("Socket Connection connected")
}

// console.log(player.x)
chatSocket.onmessage = function(event)
{
	let data = JSON.parse(event.data);
	player = data.player;
	// console.log(player.y)
	opponent = data.opponent;
	net = data.net;
	ball = data.ball;
}

	//Update pos, mov, score ...

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.addEventListener("mousemove", (event) =>{
	let rect = canvas.getBoundingClientRect();
	// player.y = event.clientY - rect.top - player.height  / 2; 
	chatSocket.send(JSON.stringify({
		'message':'moved',
		'rect': rect,
		'clientY':event.clientY
	}))
	// console.log(player.x)
})

//Defined Variables

const BALL_START_SPEED  = 	1
const COMPONRNT_LEV 	= 	.15
const BALL_DELTA_SPEED  = 	.1

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
function drawPlayer(player)
{
	drawRect(player.x, player.y, player.width, player.height, player.color);
}

function render()
{
	// Clear the cenves
		drawRect(0, 0, canvas.width, canvas.height , "BLACK");
		// Draw Net
		drawNet();
		//Drawthe ball
		drawBall(ball.x, ball.y, ball.radius, ball.color)
		//Draw players
		drawPlayer(opponent)
		drawPlayer(player)
		//display scors
		drawText(player.score, (canvas.width / 4.7), canvas.height / 5, "purple")
		drawText(opponent.score, (canvas.width / 4.2) * 3, canvas.height / 5, "purple")
}

// check collision'
// AI movment

function game()
{
	render();
}

const FPS = 60 //frims per second

setInterval(game , 1000 / FPS)

document.close();
