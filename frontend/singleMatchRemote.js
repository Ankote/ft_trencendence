
import * as utils from './utils.js';
import * as page from './pages.js';

let ID = "aankote"
let player = {}
let opponent = {}
let net = {}
let ball = {}
let table = {}


function update(Sockcet)
{  
    document.addEventListener("keydown", (event) => {    
        Sockcet.send(JSON.stringify({
            'key': event.key
        }))
    });
}

function setPlayersValues(player1, player2){
    let lplayer_name = document.getElementById('lplayer_name')
    let rplayer_name = document.getElementById('rplayer_name')
    let lplayer_score = document.getElementById('lplayer_score')
    let rplayer_score = document.getElementById('rplayer_score')
    if (lplayer_name && rplayer_name){
        lplayer_name.textContent = player1.username
        rplayer_name.textContent = player2.username
        lplayer_score.textContent = player1.score
        rplayer_score.textContent = player2.score
    }
}

function startGame(data) {
    let url = `ws://127.0.0.1:8000/ws/game/${data.room_name}/${ID}/`;

    const gameSocket = new WebSocket(url);
    utils.changeContent(page.gamePage(data));
    const canv = document.getElementById("table");
    update(gameSocket);

    gameSocket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        if (data.action == 'changes') {
            player = data.player;
            opponent = data.opponent;
            net = data.net;
            ball = data.ball;
            table = data.table;
            setPlayersValues(data.lplayer_obj, data.rplayer_obj)
            utils.render(player, opponent,ball,table,net)
        }
        if (data.action == 'game_over') {
            if (data.winner == ID)
                utils.changeContent(page.winningPage(data))
            else
                utils.changeContent(page.lossingPage(data))
        }
    }
}

export function matchMakingHandling() {
    let url = `ws://127.0.0.1:8000/ws/socket-server/`

    const matchingSocket = new WebSocket(url);

    matchingSocket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        if (data.status == 'player_joined') {
            ID = data.username
        }
        if (data.status == 'start_game') {
            startGame(data)
        }
        if (data.status == 'leaving') {
            utils.changeContent(leavingGamePage())

        }
        if (data.status == 'changes') {
            const gameData = data.data

        }
    };
}
