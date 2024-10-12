import * as utils from './utils.js'
import * as page from './pages.js'
let lplayer = {}
let rplayer = {}
let net = {}
let ball = {}
let table = {}
let countPlayers = 0;

function getPlayersNumber(type)
{
    const types= {'tour4': 4, 'tour8': 8, 'tour16': 16}
    return types[type]
}

function handelErrorUserFound(){
          
    let nicknameField = document.getElementById('nickname')
    const inputSection = document.querySelector('.input-section');
    inputSection.classList.add('found');
    countPlayers -= 1;
    document.getElementById('countPlayers').textContent = countPlayers;
    nicknameField.style.border= '2px solid red';
}

function readyButton(PlayerStatus, PlayerReadyBtn)
{
    if (!PlayerStatus)
    {
        PlayerReadyBtn.style.background = "red"
        PlayerReadyBtn.textContent = "cancel"
    }
    else
    {
        PlayerReadyBtn.style.background = "green"
        PlayerReadyBtn.textContent = "Ready"
    }
}

let isCancelled = false;

async function preparingMatch()
{
    let timer = document.getElementById('timer')
    for (let i = 0; i < 2; i++)
    {
        timer.textContent += "."
        await utils.sleep(1000)
        if (isCancelled)
        {
            timer.textContent = ""
            return true
        }
    }
    return false
}

async function start_match(lPlayerStatus, rPlayerStatus, socket)
{
    if (lPlayerStatus && rPlayerStatus)
        {
            isCancelled = false;
            if(await preparingMatch())
                return;
            utils.changeContent(page.gamePage())
            update(socket)
        socket.send(JSON.stringify({
            'action' : 'start_match',
        }))
    }
}

function Playersreadiness(socket)
{
    let lPlayerStatus = false // not ready
    let rPlayerStatus = false
    let rPlayerReadyBtn = document.getElementById('right-button')
    let lPlayerReadyBtn = document.getElementById('left-button')

    if (lPlayerReadyBtn) {
        lPlayerReadyBtn.addEventListener('click', async function ready() {
            readyButton(lPlayerStatus, lPlayerReadyBtn)
            lPlayerStatus = !lPlayerStatus
            isCancelled = true; 
            await start_match(lPlayerStatus, rPlayerStatus, socket)
        });
    }
    if (rPlayerReadyBtn) 
    {
        rPlayerReadyBtn.addEventListener('click', async function ready() 
        {
            readyButton(rPlayerStatus, rPlayerReadyBtn)
            rPlayerStatus = !rPlayerStatus
            // Left player cancelled the match
            isCancelled = true; 
            await start_match(lPlayerStatus, rPlayerStatus, socket)
        });
    }
}

function handelTournamentStart(socket, data)
{
   
    utils.tournament_board(data.tournament_stats)   
    let start = document.getElementById("start")
    start.onclick = async function start()
    {
        utils.changeContent(page.beforStartMatch());
        document.getElementById('lplayer_name').textContent = data.currentMatch[0] // left player
        document.getElementById('rplayer_name').textContent =  data.currentMatch[1] // right player
        Playersreadiness(socket);
    }
} 

function render(data){
    let game_state = data.game_state
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
    const tournamentSockcet = new WebSocket(url);

    tournamentSockcet.onopen = function(event) {
        document.getElementById('countPlayers').textContent = countPlayers;
        document.getElementById('tourType').textContent = getPlayersNumber(type);
    };

    tournamentSockcet.onmessage = async function(event) {
        let data = JSON.parse(event.data);

        if (data.status == "userFound")
            handelErrorUserFound();

        if (data.status == 'players_ready')
            handelTournamentStart(tournamentSockcet, data)

        if (data.status == 'render') 
            render(data);

        if (data.status == 'game_over') {        
            handelTournamentStart(tournamentSockcet, data)
            // tournamentSockcet.send(JSON.stringify({
            //     'action' : 'next_match',
            // })) 
        }
        if (data.status == 'next_tour'){
            tournamentSockcet.send(JSON.stringify({
                'action' : 'next_tour',
            })) 

        }
        if (data.status == 'tournament_finiched'){
            let winner = data.winner
            utils.tournament_board(data.tournament_stats)
            document.getElementById("start").style.display = "none"
        }
    }
    userJoin(tournamentSockcet)    
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
                if (nicknameField){
                    nicknameField.value = ''
                }
            }
            nicknameField.focus()
        }    
    }
}


function update(Sockcet)
{
    // if(document.getElementsByName('game_container'))
    // {
        document.addEventListener("keydown", (event) => {  
            //console.log("key  : " + event.key)      
            Sockcet.send(JSON.stringify({
                'action'  : "move_player",
                'key': event.key
            }))
        });
    
    
    // }
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
