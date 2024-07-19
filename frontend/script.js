// Select Canvas

function startGame(room_name)
{
	let url = `ws://127.0.0.1:8000/ws/game/` + room_name + '/'
	const chatSocket = new WebSocket(url);
	changeContent(gamePage(room_name))
}


function matchMakingHandling()
{
	let url = `ws://127.0.0.1:8000/ws/socket-server/` + ID + '/'

	const chatSocket = new WebSocket(url);

	chatSocket.onopen = function(event)
	{
		chatSocket.send(JSON.stringify({
			'id' : ID,
			'username' : username
		})
		)
		console.log("socket connected")
	};

	chatSocket.onmessage = function(event)
	{
		let data = JSON.parse(event.data);
		console.log(data.room_name)
		if( data.status == 'start_game')
		{
			startGame(data.room_name)
				
		}
		if( data.status == 'leaving')
		{
			changeContent(leavingGame())
				
		}
	};
}
	

document.open();
function changeContent(newContent)
{
	document.getElementById('page').innerHTML = newContent;
	console.log("conetent changed")
};

function loginPage()
{
	return `
        <input type="text" id = "ID" class="form-input" placeholder="Enter ID" required>
        <input type="text" id = "username" class="form-input" placeholder="Enter Username" required>
        <button class="submit-button" id= 'login'>Submit</button>
    `;
}

function leavingGame()
{
	return `
         <div class="victory-message">
        <h1>Opponent Gave Up</h1>
        <p>You Win!</p>
   		 </div>
    `;
}



function gamePage(room_name)
{


	return `
        '<div class="waiting-container"> 
			<div class="waiting-text"> ` + room_name + ` Game Starting . . .</div>
		</div>'
    `;
}
function matchMakingPage()
{

	let content = '<div class="button-container"> <button class="game-button" id="oneVSone">1 vs 1</button> <button class="game-button play-bot-button">Play with Bot</button></div>'
	return (content)
};

function waitingOpponent()
{
	let content = '<div class="waiting-container"> <div class="waiting-text">Waiting For  Opponent . . .</div> </div>'
	return (content)
}


changeContent(loginPage());

let ID = ""
let username = ""

document.addEventListener("click", event=>{
	let oneVSoneBtn = document.getElementById('oneVSone')
	let loginBtn = document.getElementById('login')

	if(loginBtn)
	{
		loginBtn.onclick = function display()
		{
			ID = document.getElementById('ID').value;
			username = document.getElementById('username').value;
			changeContent(matchMakingPage())

		};
	}

	if (oneVSoneBtn)
	{
		console.log()
		oneVSoneBtn.onclick = function display()
		{
			changeContent(waitingOpponent());
			matchMakingHandling();
			console.log("id : " + ID + " username : " + username)
		};

	}

})

//Update pos, mov, score ...

// document.open();
// let player = {}
// let opponent = {}
// let net = {}
// let ball = {}


// if (startGmae)
// {
// 	console.log("Starts")
// 	const canvas = document.getElementById("canvas");
// 	const ctx = canvas.getContext("2d");
	
// 	canvas.addEventListener("mousemove", (event) =>{
// 		let rect = canvas.getBoundingClientRect();
// 		// player.y = event.clientY - rect.top - player.height  / 2; 
// 		chatSocket.send(JSON.stringify({
// 			'message':'moved',
// 			'rect': rect,
// 			'clientY':event.clientY
// 		}))
// 		// console.log(player.x)
// 	})
	
// 	//Defined Variables
	
// 	const BALL_START_SPEED  = 	1
// 	const COMPONRNT_LEV 	= 	.15
// 	const BALL_DELTA_SPEED  = 	.1
	
// 	// Draw shaps & text finction
// 	function drawRect(x, y, w, h, color)
// 	{
// 		ctx.fillStyle = color;
// 		ctx.fillRect(x, y, w, h);
	
// 	}
	
// 	function drawBall(x, y, r, color)
// 	{
// 			ctx.fillStyle = color;
// 			ctx.beginPath();
// 			ctx.arc(x, y, r, Math.PI * 2, false) // math.PI : meaning draw 180 * 2 // false : 3aks 3a9arib sa3a but not 
// 																						//matter because we're going to draw complet circle
// 			ctx.closePath();	
// 			ctx.fill();
// 	}
	
// 	function drawText(text, x, y, color)
// 	{
// 		ctx.fillStyle = color;
// 		ctx.font = "45px fantasy";
// 		ctx.fillText(text, x, y)
// 	}
	
// 	function drawNet()
// 	{
// 		for (let i = 0; i <= canvas.height; i += 15)
// 		{
// 			drawRect(net.x, net.y + i, net.width, net.height, net.color)
// 		}
// 	}
	
// 	//Draw canvas ===================> render
// 	function drawPlayer(player)
// 	{
// 		drawRect(player.x, player.y, player.width, player.height, player.color);
// 	}
	
// 	function render()
// 	{
// 		// Clear the cenves
// 			drawRect(0, 0, canvas.width, canvas.height , "BLACK");
// 			// Draw Net
// 			drawNet();
// 			//Drawthe ball
// 			drawBall(ball.x, ball.y, ball.radius, ball.color)
// 			//Draw players
// 			drawPlayer(opponent)
// 			drawPlayer(player)
// 			//display scors
// 			drawText(player.score, (canvas.width / 4.7), canvas.height / 5, "purple")
// 			drawText(opponent.score, (canvas.width / 4.2) * 3, canvas.height / 5, "purple")
// 	}
	
// 	// check collision'
// 	// AI movment
	
// 	function game()
// 	{
// 		render();
// 	}
	
// 	const FPS = 60 //frims per second
	
// 	setInterval(game , 1000 / FPS)
	
// 	document.close();
	
// }
