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
        let data = JSON.parse(event.data);
        console.log(data)
        if (data.status == "userFound")
            console.log("user allready exist")
        if (data.status == 'start_tournament') {
            console.log("game start_tournament")
            tounamentSockcet.send(JSON.stringify({
                'action' : 'start_tournament'
            }))
            utils.changeContent(page.TournamentPlayersPage())   
            tounamentSockcet.send(JSON.stringify({
                'action' : 'start_match',
            }))

            let nextBtn = document.getElementById('next')
            if (nextBtn)
            { 
                nextBtn.onclick = function next(){
                    console.log("frew krew")
                tounamentSockcet.send(JSON.stringify({
                    'action' : 'next_match',
                }))

            }}   
        }
        if (data.status == 'start_match') {
            console.log(data.lplayer +" " + data.rplayer)
        }
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
                'action' : 'player_joined',
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
    // let nextBtn = document.getElementById('next')
    // console.log(nextBtn)
    // if (nextBtn)
    // { 
    //     console.log("hehe")
    //     nextBtn.onclick = function join(){
    //     socket.send(JSON.stringify({
    //         'action' : 'next_match',
    //     }))

    // }}
}