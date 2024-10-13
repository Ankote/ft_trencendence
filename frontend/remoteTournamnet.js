
import * as utils from './utils.js'
import * as page from './pages.js'

let player = {}
let opponent = {}
let net = {}
let ball = {}
let table = {}




function userJoin()
{
    // const username = document.getElementById('username')
    // console.log(username.value)
}
function startGame(data, username, tour_socket)
{
    let url = `ws://127.0.0.1:8000/ws/game/${data.room_name}/${username}/`;
    const socket = new WebSocket(url)
    utils.changeContent(page.gamePage())

    socket.onmessage = async function(event){
        let data = JSON.parse(event.data);
        if (data.action == "handel_prematch")
        {
            socket.send(JSON.stringify({
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
        if (data.action == 'game_over')
        {
            tour_socket.send(JSON.stringify({
                'action': 'game_over'
            }))
            
        }
    }

}
async function matchTournament(type){
    let url = `ws://127.0.0.1:8000/ws/remoteTournament/` + type + '/';
    const socket = new WebSocket(url)
    const joinBtn = document.getElementById("joinBtn")
    let alias_name;
    joinBtn.addEventListener("click", ()=>{
        alias_name  = document.getElementById('username').value
        console.log(alias_name)
        socket.send(JSON.stringify({
            'action' : 'player_joined',
            'nickname' : alias_name,
        }))
    });
    socket.onmessage = function(event) {
        console.log("message recived")
        const data = JSON.parse(event.data);
        const action = data.action;
        const tours = data.tournament_stats
        if (action == "start_tournament"){
            // utils.changeContent(page.TournamentBoardPage())
            utils.tournament_board(tours)
            socket.send(JSON.stringify({
                'action' : 'start_match',
            }))

        }
        if (action == 'match_starts'){
            console.log("what??")
            if (alias_name == data.player1_alias || alias_name == data.player2_alias)
            {
                let username
                if (alias_name == data.player1_alias){
                    username = data.player1_name
                    console.log("you'r first player")
                }
                else if (alias_name == data.player2_alias)
                {
                    username = data.player2_name
                    console.log("you'r second player")
                }
                startGame(data, username, socket)
            }
            else
                console.log("sbaaar ta tji nobtek azebbi")

        }

    }
}

export function handelRemoteTournament(){
    
    let tour4 = document.getElementById('tour4')
    let tour8 = document.getElementById('tour8')
    let tour16 = document.getElementById('tour16')
    let type

    if (tour4) {
        tour4.onclick = function setType() {
            type = "tour4"
            utils.changeContent(page.nickname());
            matchTournament(type);
        }
    }

    if (tour8) {
        tour8.onclick = function setType() {
            type = "tour8"
            utils.changeContent(page.tournamentPlayersJoinPage());
            matchTournament(type);
        }
    }
    if (tour16) {
        tour16.onclick = function setType() {
            type = "tour16"
            utils.changeContent(page.tournamentPlayersJoinPage());
            matchTournament(type);
        }
    }
}
