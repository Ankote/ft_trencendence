
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



function startGame(data) {
    let url = `ws://127.0.0.1:8000/ws/game/${data.room_name}/${ID}/`;

    const gameSocket = new WebSocket(url);
    const canv = document.getElementById("table");
    update(gameSocket);

    gameSocket.onmessage = async function(event) {
        let data = JSON.parse(event.data);
        if (data.action == 'handel_prematch')
        {
            let lplayer = data.lplayer_obj
            let rplayer = data.rplayer_obj
            await utils.handel_prematch(lplayer.username, rplayer.username)
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

            utils.setPlayersScore(data.lplayer_obj, data.rplayer_obj)
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

    let player1_cart;
    let player2_cart;
    let player1Name;
    let player2Name;
    let opponent;
    let player1Image;
    let player2Image;
    let vs;
    matchingSocket.onmessage = async function(event) {
        let data = JSON.parse(event.data);
        // players_info = querySelector('.playersInfo')
        // players_info.style.display = 'none'
        if (data.status == 'waiting_opponent')
        {
            console.log("here we go again")
            utils.changeContent(page.gamePage());
            player1_cart  = document.getElementById('player1');
            player2_cart  = document.getElementById('player2');
            player1Name  = document.querySelector('#player1>.name_block');
            player2Name  = document.querySelector('#player2>.name_block');
            vs  = document.querySelector('.vs');
            player1Image = document.querySelector('#player1>.image_block>.image');
            player2Image = document.querySelector('#player2>.image_block>.image');
            player1_cart.style.display = "block";
            player2_cart.style.display = "block";
            // to chick if the player is first or second
            if (data.order == 1)
            {
                opponent  = document.querySelector('#player2>.image_block')
                player1Name.textContent = data.player.username;
                player2Name.textContent = "Looking ...";
                player1Image.style.backgroundImage =  `url(${data.image})`;
                player2Image.style.backgroundImage = "url(./images/opponent.png)";
            }
            else{
                opponent  = document.querySelector('#player1>.image_block')
                player2Name.textContent = data.player.username;
                player1Name.textContent = "Looking ...";
                player2Image.style.backgroundImage =  `url(${data.image})`;
                player1Image.style.backgroundImage = "url(./images/opponent.png)";
            }
            utils.startPulseAnimation(opponent);
            // message.textContent = 'Waiting Opponent . . .' ;
            ID = data.player.username
        }
        if (data.status == 'deja') {
           utils.changeContent("deja playing");
        }
        if (data.status == 'players_matched') {
            utils.stopPulseAnimation(opponent);
            await utils.sleep(1000);
            player1Name.textContent = data.player1.username;
            player2Name.textContent = data.player2.username;
            player1Image.style.backgroundImage =  `url(${data.player1Image})`;
            player2Image.style.backgroundImage =  `url(${data.player2Image})`;
            await utils.sleep(3000)
            player1Image = document.getElementById('lplayer_img');
            player2Image = document.getElementById('rplayer_img')
            player1_cart.style.opacity = "0";
            player2_cart.style.opacity = "0";
            vs.style.opacity = "0";
            player1Image.style.backgroundImage =  `url(${data.player1Image})`;
            player2Image.style.backgroundImage =  `url(${data.player2Image})`;
            // player2Name.textContent = data.player2.username
            const carts = Array.from(document.getElementsByClassName('players_carts'));
            carts.forEach(cart=> cart.style.display = 'none');
            startGame(data);
        }
        if (data.status == 'leaving') {
            utils.changeContent(leavingGamePage())
        }
        if (data.status == 'changes') {
            const gameData = data.data;
        }
    };
}
