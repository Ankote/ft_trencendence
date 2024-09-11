import * as utils from './utils.js'
import * as page from './pages.js'
let lplayer = {}
let rplayer = {}
let net = {}
let ball = {}
let table = {}
let countPlayers = 0;
/* tours : {0: [['1', '2'], ['3', '4']], 1: [['', '']], 2: [['']]} */

// async function startingMatch(){
//     utils.drawText("Match will start at 3", 40, 50, "yellow")
//     await sleep(1000)
//     utils.drawText("Match will start at 2", 40, 50, "yellow")
//     await sleep(1000)
//     utils.drawText("Match will start at 1", 40, 50, "yellow")
//     await sleep(1000)
// }

function tournament_board(tours)
{
    console.log(tours)
    let  cptTour = 1;
    let toursObjs = {}
    let objectsCpt = 0;


    while (cptTour - 1 < Object.keys(tours).length)
    {
        let tourClassName = 'username_round' + cptTour;
        toursObjs = document.getElementsByClassName(tourClassName)
        if (toursObjs)
        {
            for (let i = 0; i < tours[cptTour - 1].length; i++)
            {
                toursObjs[objectsCpt++].textContent = tours[cptTour - 1][i][0];
                if (tours[cptTour - 1][i].length == 2)
                    toursObjs[objectsCpt++].textContent = tours[cptTour - 1][i][1];
            }
            cptTour++;
            objectsCpt =  0;
        }
    }
}

function getPlayersNumber(type)
{
    const types= {'tour4': 4, 'tour8': 8, 'tour16': 16}
    return types[type]
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function matchTournament(type) {
    let url = `ws://127.0.0.1:8000/ws/localTournament/` + type + '/'
    const tounamentSockcet = new WebSocket(url);

    tounamentSockcet.onopen = function(event) {
        document.getElementById('countPlayers').textContent = countPlayers;
        document.getElementById('tourType').textContent = getPlayersNumber(type);
    };

    tounamentSockcet.onmessage = async function(event) {
        let data = JSON.parse(event.data);

        if (data.status == "userFound"){
            
            let nicknameField = document.getElementById('nickname')
            const inputSection = document.querySelector('.input-section');
            inputSection.classList.add('found');
            countPlayers -= 1;
            document.getElementById('countPlayers').textContent = countPlayers;
            nicknameField.style.border= '2px solid red';
            console.log("user allready exist")
        }
        if (data.status == 'players_ready') {
            utils.changeContent(page.TournamentBoardPage())
            tournament_board(data.tournament_stats)   
            // await sleep(5000);
            update(tounamentSockcet)
            tounamentSockcet.send(JSON.stringify({
                'action' : 'start_tournament'
            }))
            let start = document.getElementById("start")
            start.onclick = async function start(){
                utils.changeContent(page.gamePage())
                tounamentSockcet.send(JSON.stringify({
                    'action' : 'start_match',
                }))

            }

            // let nextBtn = document.getElementById('next')
            // if (nextBtn)
            // { 
            //     nextBtn.onclick = function next(){
            //     tounamentSockcet.send(JSON.stringify({
            //         'action' : 'next_match',  
            //     }))

            // }}   
        }
        if (data.status == 'changes') {
            let game_state = data.game_state
            lplayer = game_state.lplayer;
            rplayer = game_state.rplayer;
            net = game_state.net;;
            ball = game_state.ball;
            table = game_state.table;
            utils.render(lplayer, rplayer,ball, table, net)
    }
        if (data.status == 'game_over') {
            tounamentSockcet.send(JSON.stringify({
                'action' : 'next_match',
            })) 
        }
        if (data.status == 'next_tour'){
            tounamentSockcet.send(JSON.stringify({
                'action' : 'next_tour',
            })) 

        }
        if (data.status == 'fin_tournament'){
            let tours = data.tournament
            let winner = data.winner
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
    let nicknameField = document.getElementById('nickname')
    const inputSection = document.querySelector('.input-section');
    nicknameField.addEventListener('input', function() {
        if (nicknameField.value.trim() !== "") {
            nicknameField.style.border= "none";
            inputSection.classList.remove('empty');
            inputSection.classList.remove('found');
        }
    });
    if (joinBtn)
    {
        joinBtn.onclick = function join(){
            if (nicknameField.value == '')
            {
                console.log("empty")
                inputSection.classList.add('empty');
                nicknameField.style.border= '2px solid red';
            }
            else{
                countPlayers += 1;
                document.getElementById('countPlayers').textContent = countPlayers;
                socket.send(JSON.stringify({
                    'action' : 'player_joined', 
                    'user' : nicknameField.value
                }))
                if (nicknameField)
                    nicknameField.value = '' 
            }
        }    
    }
}

function update(Sockcet)
{  
    document.addEventListener("keydown", (event) => {  
        //console.log("key  : " + event.key)      
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
            utils.changeContent(page.tournamentPlayersJoinPage());
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
