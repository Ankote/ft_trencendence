
import * as utils from './utils.js';
function startGame(data) {
    let url = `ws://127.0.0.1:8000/ws/game/${data.room_name}/${ID}/`;

    const gameSocket = new WebSocket(url);
    utils.changeContent(gamePage(data))

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
            net = data.net;
            ball = data.ball;
            table = data.table;
            utils.render()
        }
        if (data.action == 'game_over') {
            console.log(data.winner)
            console.log(data.losser)
            console.log(ID)
            if (data.winner == ID)
                utils.changeContent(winningPage(data))
            else
                utils.changeContent(lossingPage(data))
        }
    }
}

export function matchMakingHandling() {
    let url = `ws://127.0.0.1:8000/ws/socket-server/` + ID + '/'

    const matchingSocket = new WebSocket(url);

    matchingSocket.onopen = function(event) {
        matchingSocket.send(JSON.stringify({
                'id': ID,
                'username': username
            }))
    };

    matchingSocket.onmessage = function(event) {
        let data = JSON.parse(event.data);
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
