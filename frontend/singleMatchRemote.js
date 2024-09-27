
import * as utils from './utils.js';
import * as page from './pages.js';

let ID = "aankote"
let player = {}
let opponent = {}
let net = {}
let ball = {}
let table = {}

async function handel_prematch(lplayer, rplayer){
    setPlayersValues(lplayer, rplayer)
    let message  = document.getElementById('start_message')
    if (message)
    {
        message.style.display = "block"
        message.innerHTML = '<div>The match is going to  start at</div> <spane id="timeToStart"></spane>'
    }
    let timer= document.getElementById('timeToStart')
    if(timer){
        for (let i = 3; i > 0; i --){
            timer.textContent = i;
            await utils.sleep(1000)
        }
    }
    if(message)
        message.style.display="none"
}

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
    if (lplayer_name && rplayer_name){
        lplayer_name.textContent = player1.username
        rplayer_name.textContent = player2.username
    }
}

function setPlayersScore(player1, player2){
    let lplayer_score = document.getElementById('lplayer_score')
    let rplayer_score = document.getElementById('rplayer_score')
    if (lplayer_score && rplayer_score){
        lplayer_score.textContent = player1.score
        rplayer_score.textContent = player2.score
    }
}

function startGame(data) {
    let url = `ws://127.0.0.1:8000/ws/game/${data.room_name}/${ID}/`;

    const gameSocket = new WebSocket(url);
    const canv = document.getElementById("table");
    update(gameSocket);

    gameSocket.onmessage = async function(event) {
        let data = JSON.parse(event.data);
        if (data.action == 'handel_prematch')
        {
            console.log(data.lplayer_infos)
            let lplayer = data.lplayer_obj
            let rplayer = data.rplayer_obj
            await handel_prematch(lplayer, rplayer)
            gameSocket.send(JSON.stringify({
                'action': 'start_match'
            }))
        }
        if (data.action == 'changes') {
            player = data.player;
            opponent = data.opponent;
            net = data.net;
            ball = data.ball;
            table = data.table;
            setPlayersScore(data.lplayer_obj, data.rplayer_obj)
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

    matchingSocket.onmessage = async function(event) {
        let data = JSON.parse(event.data);
        if (data.status == 'waiting_opponent')
        {
            utils.changeContent(page.gamePage());
            let message  = document.getElementById('start_message')
            let player_cart  = document.getElementById('player1')
            let opponent_cart  = document.getElementById('player2')
            player_cart.style.display = "block"
            opponent_cart.style.display = "block"
            player_cart.textContent = data.player.username
            opponent_cart.textContent = "looking .."
            // message.textContent = 'Waiting Opponent . . .' ;
            ID = data.player.username
        }
        if (data.status == 'deja') {
           utils.changeContent("deja playing")
        }
        if (data.status == 'players_matched') {

            await utils.sleep(2000)
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
