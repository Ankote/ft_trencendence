import * as utils from './utils.js'
import * as page from './pages.js'

function matchTournament(type) {
    let url = `ws://127.0.0.1:8000/ws/localTournament/` + type + '/'
    const tounamentSockcet = new WebSocket(url);

    tounamentSockcet.onopen = function(event) {
        console.log("connection stablished")
    };

    tounamentSockcet.onmessage = function(event) {
        console.log("message recieved")

    }
    userJoin(tounamentSockcet)
};

function userJoin(socket){
    let joinBtn = document.getElementById('join')
    if (joinBtn)
    {
        joinBtn.onclick = function join(){
            console.log("yew")
            let nicknameField = document.getElementById('nickname')
            socket.send(JSON.stringify({
                'user' : nicknameField.value
            }))
            if (nicknameField)
                nicknameField.value = ''
        }
    }
}

export function handelTournament(){
    
    let tour4 = document.getElementById('tour4')
    let tour8 = document.getElementById('tour8')
    let tour16 = document.getElementById('tour16')
    let join = document.getElementById('join')
    let type

    if (tour4) {
        tour4.onclick = function setType() {
            type = "tour4"
            utils.changeContent(page.JoinTournamentPage());
            matchTournament(type);
        }
    }

    if (tour8) {
        tour8.onclick = function setType() {
            type = "tour8"
            utils.changeContent(page.JoinTournamentPage());
            matchTournament(type);
        }
    }
    if (tour16) {
        tour16.onclick = function setType() {
            type = "tour16"
            utils.changeContent(page.JoinTournamentPage());
            matchTournament(type);
        }
    }
}