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

function handelErrorUserFound(){
          
    let nicknameField = document.getElementById('nickname')
    const inputSection = document.querySelector('.input-section');
    inputSection.classList.add('found');
    countPlayers -= 1;
    document.getElementById('countPlayers').textContent = countPlayers;
    nicknameField.style.border= '2px solid red';
}

function handelTournamentStart(socket, tours){
    utils.changeContent(page.TournamentBoardPage())
    // console.log("current match : " + data.currentMatch);
    // console.log("next match : " + data.next_match);
    tournament_board(tours)   
    // await sleep(5000);
    socket.send(JSON.stringify({
        'action' : 'start_tournament'
    }))
    let start = document.getElementById("start")
    start.onclick = async function start(){
        utils.changeContent(page.beforStartMatch());
        let lPlayerReady = true
        let RPlayerReady = true
        let lPlayerReadyBtn = document.getElementById('left-button')
        let RPlayerReadyBtn = document.getElementById('right-button')
        let timer = document.getElementById('timer')
        if (lPlayerReadyBtn) {
            lPlayerReadyBtn.addEventListener('click', function ready() {
                if (lPlayerReady) {
                    lPlayerReadyBtn.textContent = 'Ready';
                    lPlayerReadyBtn.style.background = '#4896E2';
                } else {
                    lPlayerReadyBtn.textContent = 'Cancel';
                    lPlayerReadyBtn.style.background = 'red';
                }
                lPlayerReady = !lPlayerReady;
            });
        }
        
        if (RPlayerReadyBtn) 
        {
            RPlayerReadyBtn.addEventListener('click', function ready() 
            {
                if (RPlayerReady)
                {
                    RPlayerReadyBtn.textContent = 'Ready';
                    RPlayerReadyBtn.style.background = '#F35969';
                }
                else
                {
                    RPlayerReadyBtn.textContent = 'Cancel';
                    RPlayerReadyBtn.style.background = 'red';
                }
                RPlayerReady = !RPlayerReady;
            });
        }
        if (!RPlayerReady && !lPlayerReady){
            for (let i = 0 ; i < 5; i ++)
            {
                timer.textContent += '.'
                await sleep(1000)
            }
            update(socket)
            utils.changeContent(page.gamePage())
            socket.send(JSON.stringify({
                'action' : 'start_match',
            }))
        }
            
    }
}

function render(data){
    let game_state = data.game_state
    console.log("lplayer : " + data.lplayer_name)
    document.getElementById('lplayer_name').textContent = game_state.lplayer_name
    document.getElementById('rplayer_name').textContent =  game_state.rplayer_name
    document.getElementById('lplayer_score').textContent =  game_state.lplayer_score
    document.getElementById('rplayer_score').textContent =  game_state.rplayer_score
    lplayer = game_state.lplayer;
    rplayer = game_state.rplayer;
    net = game_state.net;;
    ball = game_state.ball;
    table = game_state.table;
    utils.render(lplayer, rplayer,ball, table, net)
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

        if (data.status == "userFound")
            handelErrorUserFound();

        if (data.status == 'players_ready')
            handelTournamentStart(tounamentSockcet, data.tournament_stats)

        if (data.status == 'render') 
            render(data);

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
