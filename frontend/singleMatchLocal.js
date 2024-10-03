
import * as singleLocalDashboard from './singleLocalDashboard.js'
import * as page from './pages.js' 
import * as utils from './utils.js' 
let lplayer = {}
let rplayer = {}
let net = {}
let ball = {}
let table = {}



function update(Sockcet)
{  
    document.addEventListener("keydown", (event) => {  
        Sockcet.send(JSON.stringify({
            'action' : 'move_player',
            'key': event.key
        }))
    });
}

async function handelStartGame(socket)
{
    utils.changeContent(page.gamePage())
    for (let i = 3; i > 0; i--){
        console.log("match will start at " + i)
        await utils.sleep(1000)
    }
    socket.send(JSON.stringify({
        'action' : 'startGame'
    }))
}

function  startGame(socket, game_state)
{
    lplayer = game_state.lplayer;
    rplayer = game_state.rplayer;
    net = game_state.net;;
    ball = game_state.ball;
    table = game_state.table;
    table.color = singleLocalDashboard.gameState.selectedTable
    console.log(table.color)
    lplayer.color = singleLocalDashboard.gameState.selectedPaddel.player1
    rplayer.color = singleLocalDashboard.gameState.selectedPaddel.player2
    document.getElementById("lplayer_name").textContent = singleLocalDashboard.gameState.playerName.player1
    document.getElementById("rplayer_name").textContent = singleLocalDashboard.gameState.playerName.player2
    document.getElementById("rplayer_score").textContent = game_state.rplayer.score;
    document.getElementById("lplayer_score").textContent = game_state.lplayer.score;
    utils.render(lplayer, rplayer,ball, table, net)
}

export function singleMatchHandle()
{
    let url = `ws://127.0.0.1:8000/ws/localSingle/`;
    const matchtSockcet = new WebSocket(url);

    matchtSockcet.onopen = function(event)
    {
        utils.changeContent(page.singleMatchPage())
        singleLocalDashboard.initGame()
    }
    matchtSockcet.onmessage = function(event){
        const data = JSON.parse(event.data);
        if (data.action == 'custom_match'){
            const startBtn = document.getElementById('startGame');
            if (startBtn)
            {
                startBtn.addEventListener('click', ()=>{
                    if (!startBtn.disabled)
                    {
                        handelStartGame(matchtSockcet)
                    }
                
                })
            }
        }
        if (data.action == 'startGame'){
            update(matchtSockcet)
        }
        if (data.action == 'changes'){
            const game_state = data.game_state
            startGame(matchtSockcet, game_state)

        }
    }
}
    // update(matchtSockcet)
    // matchtSockcet.onmessage = function(event){
    //     let data = JSON.parse(event.data);
    //     let game_state = data.game_state
    //     if (data.action == 'changes') {
    //         lplayer = game_state.lplayer;
    //         rplayer = game_state.rplayer;
    //         net = game_state.net;;
    //         ball = game_state.ball;
    //         table = game_state.table;
    //         const pname = game_state.name;
    //         document.getElementById("rplayer_name").textContent = pname
    //         document.getElementById("rplayer_score").textContent = game_state.rplayer.score;
    //         document.getElementById("lplayer_score").textContent = game_state.lplayer.score;
    //         utils.render(lplayer, rplayer,ball, table, net)
    //     }
        // if (data.action == 'game_over') {
        // }
//     }
// }