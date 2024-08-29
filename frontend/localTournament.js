import * as utils from './utils.js'
import * as page from './pages.js'
let lplayer = {}
let rplayer = {}
let net = {}
let ball = {}
let table = {}

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
            update(tounamentSockcet)
            console.log("game start_tournament")
            tounamentSockcet.send(JSON.stringify({
                'action' : 'start_tournament'
            }))
            utils.changeContent(page.gamePage())   
            tounamentSockcet.send(JSON.stringify({
                'action' : 'start_match',
            }))

            let nextBtn = document.getElementById('next')
            if (nextBtn)
            { 
                nextBtn.onclick = function next(){
                tounamentSockcet.send(JSON.stringify({
                    'action' : 'next_match',  
                }))

            }}   
        }
        if (data.status == 'changes') {
            let game_state = data.game_state
            lplayer = game_state.lplayer;
            rplayer = game_state.rplayer;
            net = game_state.net;;
            ball = game_state.ball;
            table = game_state.table;
            utils.render(lplayer, rplayer,ball, table, net)
            console.log(game_state.lplayer_name +" " + game_state.rplayer_name)
        }
        if (data.status == 'game_over') {
            tounamentSockcet.send(JSON.stringify({
                'action' : 'next_match',
            })) 
           console.log("nextMatch")
        }
        if (data.status == 'next_tour'){
            tounamentSockcet.send(JSON.stringify({
                'action' : 'next_tour',
            })) 

        }
        if (data.status == 'fin_tournament'){
            console.log("tournament_finiched")
            let tours = data.tournament
            let winner = data.winner
            console.log(tours)
            utils.changeContent(page.Congratulations(winner))
            tounamentSockcet.send(JSON.stringify({
                'action' : 'fin_tournament',
            })) 

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

function update(Sockcet)
{  
    document.addEventListener("keydown", (event) => {  
        console.log("key  : " + event.key)      
        Sockcet.send(JSON.stringify({
            'action'  : "move_player",
            'key': event.key
        }))
    });
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