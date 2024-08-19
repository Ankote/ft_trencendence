import * as page from './pages.js' 
import * as utils from './utils.js' 
let lplayer = {}
let rplayer = {}
let net = {}
let ball = {}
let table = {}

export function update(Sockcet)
{
      
   
    Sockcet.send(JSON.stringify({
        'key': key
    }))
}

export function singleMatchHandle()
{
    let url = `ws://127.0.0.1:8000/ws/localSingle/`;
    const matchtSockcet = new WebSocket(url);

    matchtSockcet.onopen = function(event)
    {
        console.log("connecting")
        utils.changeContent(page.gamePage())
    }

    matchtSockcet.onmessage = function(event){
        let data = JSON.parse(event.data);
        let game_state = data.game_state
        if (data.action == 'changes') {
            lplayer = game_state.lplayer;
            rplayer = game_state.rplayer;
            net = game_state.net;;
            ball = game_state.ball;
            table = game_state.table;
            utils.render(lplayer, rplayer,ball, table, net)
        }
    }
}