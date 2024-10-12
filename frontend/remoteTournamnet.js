
import * as utils from './utils.js'
import * as page from './pages.js'


function userJoin()
{
    // const username = document.getElementById('username')
    // console.log(username.value)
}

async function matchTournament(type){
    let url = `ws://127.0.0.1:8000/ws/remoteTournament/` + type + '/';
    const socket = new WebSocket(url)
    const joinBtn = document.getElementById("joinBtn")

    joinBtn.addEventListener("click", ()=>{
        const username = document.getElementById('username').value
        console.log(username)
        socket.send(JSON.stringify({
            'action' : 'player_joined',
            'nickname' : username,
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
        if (action == 'start_match')
            console.log(data)

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
