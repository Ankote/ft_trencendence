// Select table
let player = {}
let opponent = {}
let net = {}
let ball = {}
let table = {}
let ctx

function startGame(room_name) {
    let url = `ws://127.0.0.1:8000/ws/game/${room_name}/${ID}/`;

    const gameSocket = new WebSocket(url);
    changeContent(gamePage(room_name))
    const canv = document.getElementById("canvas");
    ctx = canv.getContext("2d");

    canv.addEventListener("mousemove", (event) => {
        let rect = canv.getBoundingClientRect();
        gameSocket.send(JSON.stringify({
            'action': 'moved',
            'rect': rect,
            'clientY': event.clientY
        }));
    });

    gameSocket.onmessage = function(event) {
        console.log("mouseMove")
        let data = JSON.parse(event.data);
        if (data.action == 'changes') {
            player = data.player;
            opponent = data.opponent;
            net = data.net;;
            ball = data.ball;
            table = data.table;
            render()
        }
        if (data.action == 'game_over') {
            console.log(data.winner)
            console.log(data.losser)
            console.log(ID)
            if (data.winner == ID)
                changeContent(winningPage(data))
            else
                changeContent(lossingPage(data))
        }
    }
}

function matchMakingHandling() {
    let url = `ws://127.0.0.1:8000/ws/socket-server/` + ID + '/'

    const matchingSocket = new WebSocket(url);

    matchingSocket.onopen = function(event) {
        matchingSocket.send(JSON.stringify({
                'id': ID,
                'username': username
            }))
            // console.log("socket connected")
    };

    matchingSocket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        // console.log(data.room_name)
        if (data.status == 'start_game') {

            startGame(data.room_name)

        }
        // console.log(data.status)
        if (data.status == 'leaving') {
            changeContent(leavingGamePage())

        }
        if (data.status == 'changes') {
            const gameData = data.data
                // console.log(gameData)

        }
    };
}

document.open();

function changeContent(newContent) {
    document.getElementById('page').innerHTML = newContent;
};

function loginPage() {
    return `
        <input type="text" id = "ID" class="form-input" placeholder="Enter ID" required>
        <input type="text" id = "username" class="form-input" placeholder="Enter Username" required>
        <button class="submit-button" id= 'login'>Submit</button>
    `;
}

function JoinTournamentPage() {
    return `
        <input type="text" id = "nickname" class="form-input" placeholder="Enter nickname" required>
        <button class="submit-button" id= 'join'>join</button>
    `;
}

function leavingGamePage() {
    // console.log("wewwewew")
    return `
	<div class="victory-message">
		<h1>You Win!</h1>
		<p>Congratulations, ${data.winner}!</p>
		<p>Your Score: ${data.winnerScore}</p>
	</div>
`;
}

function winningPage(data) {
    // console.log("wewwewew")
    return `
	<div class="victory-message">
		<h1>You Win!</h1>
		<p>Congratulations, ${data.winner}!</p>
		<p>${data.winner}: ${data.winnerScore}</p>
		<p>${data.loser}: ${data.loserScore}</p>
	</div>
`;
}

function lossingPage(data) {
    // console.log("wewwewew")

    return `
	<div class="victory-message">
		<h1>You Lose!</h1>
		<p>Good luck next time, ${data.loser}!</p>
		<p>${data.winner}: ${data.winnerScore}</p>
		<p>${data.loser}: ${data.loserScore}</p>
	</div>
`;
}

function gamePage(room_name) {

    return `
           <canvas id='canvas' style="background : black;" width="600" height="400"></canvas>
    `;
}

function matchMakingPage() {


    return `
		 
	<div class="button-container">
		<button class="game-button" id="oneVSone">1 vs 1</button>
		<button class="game-button play-bot-button">Play with Bot</button>
		<button class="game-button play-bot-button" id="tournament">Play Tournament</button>
	</div>'
	`
};

function watingPlayersPage() {

    return `
		<div class="waiting-container">
			<div class="waiting-text">Waiting For  other Players . . .</div>
		</div>
	`
}

changeContent(loginPage());

let ID = ""
let username = ""
let nickname = ""
data = {}

function matchTournament(nickname) {
    console.log(nickname)
    let url = `ws://127.0.0.1:8000/ws/tournament/` + nickname + '/'
    const tounamentSockcet = new WebSocket(url);

    tounamentSockcet.onopen = function(event) {
        console.log("connection stablished")
        tounamentSockcet.send(JSON.stringify({
            'id': ID,
            'username': username
        }))
    };

    tounamentSockcet.onmessage = function(event) {
        console.log("message recieved")

        let data = JSON.parse(event.data);
        if (data.status == 'waiting') {

            console.log("waiting")
        }
    };
};

document.addEventListener("click", event => {
    let oneVSoneBtn = document.getElementById('oneVSone')
    let loginBtn = document.getElementById('login')
    let tourBtn = document.getElementById('tournament')
    let joinBtn = document.getElementById('join')

    if (loginBtn) {
        loginBtn.onclick = function display() {
            ID = document.getElementById('ID').value;
            username = document.getElementById('username').value;
            changeContent(matchMakingPage())

        };
    }

    if (oneVSoneBtn) {
        oneVSoneBtn.onclick = function display() {
            if (ID != "") {
                changeContent(waitingOpponent());
                matchMakingHandling();
            }
            // console.log("id : " + ID + " username : " + username)
        };
    }
    if (tourBtn) {
        tourBtn.onclick = function display() {
            if (ID != "") {
                changeContent(JoinTournamentPage());

            }
        };
    }
    if (joinBtn) {
        joinBtn.onclick = function display() {
            if (ID != "") {
                console.log("ayooow")
                nickname = document.getElementById('nickname').value;
                console.log("hi : " + document.getElementById('nickname').value)
                changeContent(watingPlayersPage());
                matchTournament(nickname);

            }
        };
    }

})

// Draw shapes & text functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i <= table.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawPlayer(player) {
    drawRect(player.x, player.y, player.width, player.height, player.color);
}

function render() {
    // Clear the cenves
    drawRect(0, 0, table.width, table.height, "BLACK");
    // Draw Net
    drawNet();
    //Drawthe ball
    drawBall(ball.x, ball.y, ball.radius, ball.color)
        //Draw players
    drawPlayer(opponent)
    drawPlayer(player)
        //display scors
    drawText(player.score, (table.width / 4.7), table.height / 5, "purple")
    drawText(opponent.score, (table.width / 4.2) * 3, table.height / 5, "purple")
}

// Check collision and AI movement can be added here

// function game() {
// 	render();
// }

// const FPS = 60; // frames per second
// setInterval(game, 1000 / FPS);